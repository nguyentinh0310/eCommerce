import { ProductsRepository } from '@modules/products/products.repository';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepository } from './cart.repository';
import { CreateCartDto, ShopOrderIdsDto } from './dto/cart.dto';

/**
  1, Add product to Cart [User]
  2, Reduce product quantity [User]
  3, Increase product quantity [User]
  4, Get list to Cart [User]
  5, Delete cart [User]
  6, Delete cart item [User]
*/

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async addToCart({ userId, product }: CreateCartDto) {
    // kiểm tra cart có tồn tại hay ko?
    const cart = await this.cartRepository.findByCondition({ userId })
    const productItem = await this.productsRepository.findByCondition({ _id: product.productId })
    if(!productItem) throw new NotFoundException(`Product not found`);

    // Thêm thông tin name và price từ productItem vào product
    product.name = productItem.name;
    product.price = productItem.price;

    // Nếu giỏ hàng chưa tồn tại -> tạo giỏ hàng
    if(!cart) {
      return await this.cartRepository.createOrUpdateCart({ userId, product })
    }

    // Nếu giỏ hàng tồn tại và có sản phẩm đó rồi -> update quantity
    const existingProduct = cart.products.find(p => p.productId === product.productId)
    if(existingProduct) {
      return await this.cartRepository.updateCartQuantity({ userId, product })
    } else {
      // Nếu giỏ hàng tồn tại và đã có sản phẩm nhưng thêm 1 sản phẩm mới !
      return await this.cartRepository.createOrUpdateCart({ userId, product })
    }
  }

  /**
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId
            old_quantity,
            productId
          }
        ],
        version
      }
    ]
  */
  async updateCart({ userId, shop_order_ids }: { userId: string; shop_order_ids: ShopOrderIdsDto[] }) {
    // Tính tổng số lượng thay đổi
    let totalQuantityChange = 0;

    // kiểm tra cart có tồn tại hay ko?
    const cart = await this.cartRepository.findByCondition({ userId })
    if(!cart) throw new NotFoundException("Cart not found")
    if(!Array.isArray(shop_order_ids)) throw new HttpException('Invalid shopOrder', HttpStatus.BAD_REQUEST)

    // Lấy danh sách các productId từ shop_order_ids
    const productIds = shop_order_ids.flatMap(
      ({ item_products }: ShopOrderIdsDto) => item_products.map((item) => item.productId)
    )

    // Kiểm tra sự tồn tại của tất cả các sản phẩm cùng một lúc
    const existingProducts = await this.productsRepository.find({ _id: { $in: productIds }})

    // Lặp qua từng đơn hàng từ cửa hàng để cập nhật giỏ hàng
    for (const shopOrder of shop_order_ids) {
      const { shopId, item_products } = shopOrder

      // Kiểm tra xem shop có tồn tại trong giỏ hàng không?
      const shopIndex = cart.products.findIndex((item) => item.shopId === shopId)

      // Cửa hàng đã tồn tại trong giỏ hàng, tiến hành cập nhật thông tin sản phẩm
      if (item_products && Array.isArray(item_products) && shopIndex !== -1) {
        for (const products of item_products) {
          const { productId, quantity, old_quantity } = products
          // Kiểm tra sự tồn tại của sản phẩm trong danh sách productIds
          const product = existingProducts.find((item) => item._id.toString() === productId)
          if(!product) throw new NotFoundException(`Product with ID ${productId} not found`);

          // Tìm sản phẩm trong cửa hàng
          const productIndex = cart.products.findIndex((item) => item.productId === productId)
          if (productIndex !== -1) {
            // Sản phẩm đã tồn tại, cập nhật thông tin sản phẩm
            shop_order_ids[shopIndex].item_products[productIndex] = {
              quantity,
              old_quantity,
              productId,
            }
           
            // Cập nhật tổng số lượng thay đổi
            totalQuantityChange = quantity - old_quantity
          }
        }
      } else {
        throw new HttpException("Invalid products", HttpStatus.BAD_REQUEST)
      }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    if (totalQuantityChange !== 0) {
      return await this.cartRepository.updateCartQuantity({
        userId,
        product: {
          productId: existingProducts.map((item) => item._id.toString()),
          quantity: totalQuantityChange
        }
      })
       
    }
  }

  async removeProductFromCart(userId: string, productId: string) {
    const deletedCart = await this.cartRepository.removeProductFromCart(userId, productId)
    return deletedCart.modifiedCount
  }

  async getListCartUser(userId: Types.ObjectId): Promise<any> {
    return await this.cartRepository.findByCondition(userId)
  }
}
