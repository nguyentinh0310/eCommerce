import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@utils/base.repository';
import { Discount, DiscountDocument } from './discount.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISelectData } from 'types/common';
import { getSelectData, unGetSelectData } from '@utils/common';

@Injectable()
export class DiscountRepository extends BaseRepository<DiscountDocument> {
  constructor(
    @InjectModel(Discount.name)
    private readonly discountModel: Model<DiscountDocument>,
  ) {
    super(discountModel);
  }

  async findAllDiscountCodesUnSelect({ limit, sort, page, filter, unSelect }: ISelectData) {
    const skip = (page - 1) * limit;
    const sortBy: any = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
    return await this.discountModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(unGetSelectData(unSelect))
      .lean();
  }

  async findAllDiscountCodeSelect({ limit, sort, page, filter, select }: ISelectData) {
    const skip = (page - 1) * limit;
    const sortBy: any = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
    return await this.discountModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
  }
}
