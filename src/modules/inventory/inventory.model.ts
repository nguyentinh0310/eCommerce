import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ collection: 'inventories' })
export class Inventory {
  constructor(productId: MongooseSchema.Types.ObjectId, location: string, stock: number, shopId: MongooseSchema.Types.ObjectId, reservations: any[], createdAt: number, updatedAt: number) {
    this.productId = productId;
    this.location = location;
    this.stock = stock;
    this.shopId = shopId;
    this.reservations = reservations;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: MongooseSchema.Types.ObjectId

  @Prop({ default: 'unknown' })
  location: string

  @Prop({ required: true })
  stock: number

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  shopId: MongooseSchema.Types.ObjectId

  @Prop({ type: Array, default: [] })
  reservations: any[]; // [{ cardId, stock, createOn }]

  @Prop({ default: Date.now })
  createdAt: number;

  @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
  updatedAt: number;
}

const InventorySchema = SchemaFactory.createForClass(Inventory);

export { InventorySchema };
