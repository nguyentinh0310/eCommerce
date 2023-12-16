import { Injectable } from '@nestjs/common';
import { Clothing, ClothingDocument, Electronic, ElectronicDocument, Furniture, FurnitureDocument, Product, ProductDocument,
} from './products.model';
import { BaseRepository } from '@utils/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { getSelectData, unGetSelectData } from '@utils/common';
import { ISelectData } from 'types/common';

interface IQueryProduct {
  query: any;
  limit: number;
  skip: number;
}

export interface IProductShop {
  shopId: Types.ObjectId;
  productId: Types.ObjectId;
}

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async findAllDraft({ query, limit, skip }: IQueryProduct) {
    return await this.queryProduct({ query, limit, skip });
  }

  async findAllPublish({ query, limit, skip }: IQueryProduct) {
    return await this.queryProduct({ query, limit, skip });
  }

  async publishProduct({ shopId, productId }: IProductShop) {
    // set isPublished = true
    const { modifiedCount } = await this.productModel.updateOne(
      {
        shop: new Types.ObjectId(shopId),
        _id: new Types.ObjectId(productId),
      },
      {
        $set: { isDraft: false, isPublished: true },
      },
    );

    return modifiedCount;
  }

  async unPublishProduct({ shopId, productId }: IProductShop) {
    // set isDraft = true
    const { modifiedCount } = await this.productModel.updateOne(
      {
        shop: new Types.ObjectId(shopId),
        _id: new Types.ObjectId(productId),
      },
      {
        $set: { isDraft: true, isPublished: false },
      },
    );

    return modifiedCount;
  }

  async searchProduct(query: string) {
    const regexSearch = new RegExp(query, 'i');
    const results = await this.productModel
      .find(
        { $text: { $search: regexSearch.source } },
        { score: { $meta: 'textScore' } },
      ) // meta của trường text index
      .sort({ score: { $meta: 'textScore' } })
      .lean();

    return results;
  }

  async findAllProduct({ limit, sort, page, filter, select }: ISelectData) {
    const skip = (page - 1) * limit;
    const sortBy: any = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
    return await this.productModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
  }

  async findProduct({ productId, unSelect }: any) {
    return await this.productModel
      .findById(productId)
      .select(unGetSelectData(unSelect))
      .lean();
  }

  private async queryProduct({ query, limit, skip }: IQueryProduct) {
    return await this.productModel
      .find(query)
      .populate('shop', 'name email -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
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
