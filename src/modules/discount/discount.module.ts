import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { ProductsModule } from '@modules/products/products.module';
import { DiscountRepository } from './discount.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './discount.model';

@Module({
  imports: [ProductsModule,
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }])],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
})
export class DiscountModule {}
