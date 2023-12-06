import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  constructor(
    name: string,
    description: string,
    thumbnail: string,
    price: number,
    quantity: number,
    type: string,
    shop: string,
    attributes: Record<string, any>,
  ) {
    this.name = name;
    this.description = description;
    this.thumbnail = thumbnail;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  shop: string;

  @ApiProperty()
  attributes: Record<string, any>;
}
