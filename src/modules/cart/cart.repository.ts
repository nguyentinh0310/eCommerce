import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@utils/base.repository';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.model';
import { CartState } from '@enums/cart.enum';

@Injectable()
export class CartRepository extends BaseRepository<CartDocument> {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {
    super(cartModel);
  }

  async createOrUpdateCart({ userId, product }: {userId: string, product: Record<string, any>}) {
    return await this.cartModel.findOneAndUpdate(
        { userId, state: CartState.Active },
        { $addToSet: { products: product }},
        { upsert: true, new: true },
      ).lean();
  }

  async updateCartQuantity({ userId, product }: {userId: string, product: Record<string, any>}) {
    const { productId, quantity } = product;

    return await this.cartModel.findOneAndUpdate(
      { userId, "products.productId": productId, state: CartState.Active },
      { $inc: { "products.$.quantity": quantity }},
      { upsert: true, new: true }
    ).lean();
  }

  async removeProductFromCart(userId: string, productId: string) {
    return this.cartModel.updateOne(
      { userId, state: CartState.Active },
      { $pull: { products: { productId } } }
    )
  }
}
