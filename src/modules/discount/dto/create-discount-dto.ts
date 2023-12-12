import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
  constructor(name: string, description: string, type: string, value: number, code: string, start_date: Date, end_date: Date, max_uses: number, uses_count: number, uses_used: any[], max_users_per_user: number, min_order_value: number, shopId: string, is_active: boolean, applies_to: string, product_ids: any[]) {
    this.name = name;
    this.description = description;
    this.type = type;
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
  }

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  max_uses: number;

  @ApiProperty()
  @IsNotEmpty()
  uses_count: number;

  @ApiProperty()
  @IsNotEmpty()
  uses_used: any[];

  @ApiProperty()
  @IsNotEmpty()
  max_users_per_user: number;

  @ApiProperty()
  @IsNotEmpty()
  min_order_value: number;

  @ApiProperty()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty()
  applies_to: string;

  @ApiProperty()
  @IsNotEmpty()
  product_ids: any[];
}
