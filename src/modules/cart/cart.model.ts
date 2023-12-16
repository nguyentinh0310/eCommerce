import { CartState } from '@enums/cart.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ collection: 'carts' })
export class Cart {
  constructor(state: string, products: any[], count_product: number, userId: MongooseSchema.Types.ObjectId, createdOn: number, modifiedOn: number) {
    this.state = state;
    this.products = products;
    this.count_product = count_product;
    this.userId = userId;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;
  }

  @Prop({ required: true, enum: CartState, default: CartState.Active })
  state: string

  @Prop({ type: Array, default: [] })
  products: any[]; // [{ productId, shopId, createOn }]

  @Prop({ required: true })
  count_product: number

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId

  @Prop({ default: Date.now })
  createdOn: number;

  @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
  modifiedOn: number;
}

const CartSchema = SchemaFactory.createForClass(Cart);

export { CartSchema };
