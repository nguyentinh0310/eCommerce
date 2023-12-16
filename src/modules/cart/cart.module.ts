import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.model';
import { ProductsModule } from '@modules/products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }
  ])],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
