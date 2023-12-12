import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DiscountRepository } from './discount.repository';
import { CreateDiscountDto } from './dto/create-discount-dto';
import { Types, ObjectId } from 'mongoose';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { removeUnderfinedObject } from '@utils/common';
import { Discount } from './discount.model';
import { ProductsRepository } from '@modules/products/products.repository';
import { Product } from '@modules/products/products.model';

/**
   1, Generator Discount Code [Shop | Admin]
   2, Get all discount codes [User | Shop]
   3, Get all product by discount code [User]
   4, Get discount amount [User]
   5, Delete discount Code [Admin | Shop]
   6, Cancel discount Code [User]
*/

@Injectable()
export class DiscountService {
  constructor(
    private readonly discountRepository: DiscountRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createDiscountCode(payload: CreateDiscountDto): Promise<Discount> {
    // kiểm tra start_date lớn hơn end_date --> false
    if (new Date(payload.start_date) > new Date(payload.end_date))
      throw new HttpException('Start date must less than End date', HttpStatus.BAD_REQUEST);
    // Tìm kiếm discount tồn tại và is_active: true --> Discount exist
    const discount = await this.discountRepository.findByCondition({
      code: payload.code,
      shopId: new Types.ObjectId(payload.shopId)
    })

    if(discount && discount.is_active === true) 
      throw new HttpException('Discount has existed', HttpStatus.BAD_REQUEST);

    const newDiscount = await this.discountRepository.create({
      ...payload,
      min_order_value: payload.min_order_value || 0,
      start_date: new Date(payload.start_date),
      end_date: new Date(payload.end_date),
      product_ids: payload.applies_to === 'all' ? [] : payload.product_ids
    })
    return newDiscount   
  }

  async updateDiscountCode(discountId: Types.ObjectId ,payload: UpdateDiscountDto): Promise<Discount> {
    // Xóa attribute giá trị là null, underfined
    const objectParams = removeUnderfinedObject(payload);

    // kiểm tra start_date lớn hơn end_date --> false
    if (new Date(objectParams.start_date) > new Date(objectParams.end_date))
    throw new HttpException('Start date must less than End date', HttpStatus.BAD_REQUEST);

    const discount = await this.discountRepository.findByIdAndUpdate(discountId, {
      ...objectParams,
      updatedAt: new Date().getTime()
    })
    if(!discount) 
      throw new NotFoundException('Discount not found');

    return discount
  }

  async getAllDiscountCodes(payload: any) {
    const { code, shopId, limit, page } = payload

    // kiểm tra discount tồn tại .findOne({ code, shopId })
    const discount = await this.discountRepository.findByCondition({ 
      code, 
      shopId: new Types.ObjectId(payload.shopId)
    })
    if(!discount || !discount.is_active) 
      throw new NotFoundException('Discount not found');

    let product
    const { product_ids, applies_to } = discount

    // check applies_to === "all" --> get all product
    if(applies_to === "all") {
      product = await this.productsRepository.findAllProduct({
        filter: { 
          shop: new Types.ObjectId(shopId),
          isPublished: true, 
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ["name", "thumbnail", "price"]
      })
    }

    // check applies_to === "specific" --> get product_ids
    if(applies_to === "specific") {
      product = await this.productsRepository.findAllProduct({
        filter: { 
          _id: { $in: product_ids },
          isPublished: true, 
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ["name", "thumbnail", "price"]
      })
    }

    return product
  }

  async getAllDiscountCodeByShop(payload: any) {
    const { shopId, limit, page } = payload
    return await this.discountRepository.findAllDiscountCodeSelect({
      filter: { 
        shopId: new Types.ObjectId(shopId),
      },
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ["name", "code", "description"]
    })
  }

  async getDiscountAmount(payload: any) {
    const  { codeId, shopId, userId, products } = payload
    // kiểm tra discount tồn tại
    const discount = await this.discountRepository.findByCondition({
      code: codeId,
      shopId: new Types.ObjectId(shopId)
    })
    if(!discount) throw new NotFoundException('Discount not found');

    const { value, type, is_active, max_uses, start_date, end_date, min_order_value, max_users_per_user, uses_used } = discount
    // check is_active --> throw err expired,  max_uses --> discount are out
    if(!is_active) throw new NotFoundException('Discount expired');
    if(!max_uses) throw new NotFoundException('Discount are out');

    // kiểm tra start_date và end_date --> throw err expired
    if (new Date () < new Date(start_date) || new Date () > new Date(end_date))
      throw new NotFoundException('Discount are out');
    
    // kiểm tra min_order_value > 0 --> get totalOrder và so sánh với min_order_value
    let totalOrder = 0 
    if(min_order_value > 0) {
      totalOrder = products.reduce((acc: any, product: Product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if(totalOrder < min_order_value) 
        throw new NotFoundException(`Discount requires a minium order value of ${min_order_value}`);
    }

    if(max_users_per_user > 0) {
      const userUsed = uses_used.find((user: any) => user.userId === userId)
      if(userUsed) throw new HttpException('Discount are applied code', HttpStatus.BAD_REQUEST);
    }  
    // Check discount là fixed_amount hay percentage
    const amount = type === 'fixed_amount' ? value : totalOrder * (value / 100)
    
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  async deleteDiscountCode({ shopId, code }: any): Promise<any> {
    const deleted = await this.discountRepository.findOneAndDelete({
      code,
      shopId: new Types.ObjectId(shopId)
    })
    return deleted
  }

  async cancelDiscountCode({ shopId, code }: any): Promise<any> {
    const discount = await this.discountRepository.findByCondition({
      code,
      shopId: new Types.ObjectId(shopId)
    })
    if(!discount) throw new NotFoundException('Discount not found');

    const result = await this.discountRepository.findByIdAndUpdate(discount._id, {
      $pull: {
        uses_used: shopId
      },
      $inc: {
        max_use: 1,
        uses_count: -1
      }
    })
    return result
  }
}
