import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';

export type DiscountDocument = Discount & Document;

@Schema({ collection: 'discounts' })
export class Discount {
  constructor(name: string, description: string, type: string, value: number, code: string, start_date: Date, end_date: Date, max_uses: number, uses_count: number, uses_used: any[], max_users_per_user: number, min_order_value: number, shopId: MongooseSchema.Types.ObjectId, is_active: boolean, applies_to: string, product_ids: any[], createdAt: number, updatedAt: number) {
    this.name = name;
    this.description = description;
    this.type = type
    this.value = value;
    this.code = code;
    this.start_date = start_date;
    this.end_date = end_date;
    this.max_uses = max_uses;
    this.uses_count = uses_count;
    this.uses_used = uses_used;
    this.max_users_per_user = max_users_per_user;
    this.min_order_value = min_order_value;
    this.shopId = shopId;
    this.is_active = is_active;
    this.applies_to = applies_to;
    this.product_ids = product_ids;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, enum: ['fixed_amount', 'percentage'], default: 'fixed_amount' })
  type: string

  @Prop({ required: true })
  value: number
  
  @Prop({ required: true })
  code: string // discount code

  @Prop({ required: true })
  start_date: Date

  @Prop({ required: true })
  end_date: Date

  @Prop({ required: true })
  max_uses: number // số lượng discount được áp dụng

  @Prop({ required: true })
  uses_count: number // số discount đã sử dụng

  @Prop({ required: true })
  uses_used: any[] // User nào đã sử dụng

  @Prop({ required: true })
  max_users_per_user: number // số lượng cho phép tối đa sử dụng mỗi user

  @Prop({ required: true })
  min_order_value: number // Giá trị đơn hàng tối thiểu

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  shopId: MongooseSchema.Types.ObjectId

  @Prop({ required: true })
  is_active: boolean

  @Prop({ required: true, enum: ['all', 'specific'] })
  applies_to: string

  @Prop({ type: Array, default: [] })
  product_ids: any[];

  @Prop({ default: Date.now })
  createdAt: number;

  @Prop({ default: Date.now, set: (value: any) => value || Date.now() })
  updatedAt: number;
}

const DiscountSchema = SchemaFactory.createForClass(Discount);

export { DiscountSchema };
