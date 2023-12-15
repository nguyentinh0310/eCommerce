import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class ItemProductDto {
  constructor(quantity: number, old_quantity: number, price: number, name: string, shopId: string, productId: string) {
    this.quantity = quantity;
    this.old_quantity = old_quantity;
    this.price = price;
    this.name = name;
    this.shopId = shopId;
    this.productId = productId;
  }

  @IsNumber()
  quantity: number;

  @IsNumber()
  old_quantity: number;

  @IsNumber()
  price?: number;

  @IsString()
  name?: string;

  @IsString()
  shopId?: string;

  @IsString()
  productId: string;
}

export class ShopOrderIdsDto {
  constructor(shopId: string, item_products: ItemProductDto[]) {
    this.shopId = shopId;
    this.item_products = item_products;
  }

  @IsString()
  shopId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemProductDto)
  item_products: ItemProductDto[];

  @IsNumber()
  version?: number;
}

export class CreateCartDto {
    constructor(userId: string, product: ItemProductDto){
        this.userId = userId
        this.product = product
    }

    @IsString()
    userId: string;
    
    @IsObject()
    product: ItemProductDto
}

export class UpdateCartDto {
    constructor(userId: string, shop_order_ids: ShopOrderIdsDto[]){
        this.userId = userId
        this.shop_order_ids = shop_order_ids
    }

    @IsString()
    userId: string;

    @IsArray()
    @Type(() => ShopOrderIdsDto)
    shop_order_ids: ShopOrderIdsDto[]
}