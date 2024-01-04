import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Clothing, ClothingSchema, Electronic, ElectronicSchema, Furniture, FurnitureSchema, Product, ProductSchema } from './products.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ClothingRepository, ElectronicRepository, FurnitureRepository, ProductsRepository } from './products.repository';
import { InventoryModule } from '@modules/inventory/inventory.module';

@Module({
  imports: [
    InventoryModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Clothing.name, schema: ClothingSchema },
      { name: Electronic.name, schema: ElectronicSchema },
      { name: Furniture.name, schema: FurnitureSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ClothingRepository, ElectronicRepository, FurnitureRepository],
  exports: [ProductsService, ProductsRepository]
})
export class ProductsModule {}
