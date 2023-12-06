import { Injectable } from '@nestjs/common';
import { Clothing, ClothingDocument, Electronic, ElectronicDocument, Furniture, FurnitureDocument, Product, ProductDocument } from './products.model';
import { BaseRepository } from '@utils/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }
}

@Injectable()
export class ClothingRepository extends BaseRepository<ClothingDocument> {
  constructor(
    @InjectModel(Clothing.name)
    private readonly clothingModel: Model<ClothingDocument>,
  ) {
    super(clothingModel);
  }
}

@Injectable()
export class ElectronicRepository extends BaseRepository<ElectronicDocument> {
  constructor(
    @InjectModel(Electronic.name)
    private readonly electronicModel: Model<ElectronicDocument>,
  ) {
    super(electronicModel);
  }
}

@Injectable()
export class FurnitureRepository extends BaseRepository<FurnitureDocument> {
  constructor(
    @InjectModel(Furniture.name)
    private readonly furnitureModel: Model<FurnitureDocument>,
  ) {
    super(furnitureModel);
  }
}
