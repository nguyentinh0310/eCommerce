import { Model, FilterQuery, QueryOptions, Document, PopulateOptions } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc: any): Promise<any> {
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T | null> {
    const result = await this.model.findById(id, option).lean();
    return result !== null ? (result as T) : null;
  }

  async findByCondition(filter: FilterQuery<T>, field?: any | null, option?: QueryOptions | null, populate?: PopulateOptions | null): Promise<T | null> {
    const query = this.model.findOne(filter, field, option);
    if (populate) {
      query.populate(populate).lean();
    }
    return query.lean();
  }

  async getByCondition(
    filter: any,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate).lean();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().lean();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
      const count = await this.model.countDocuments(filter).exec();
      return count;
  }

  async aggregate(option: any) {
    return this.model.aggregate(option).exec();
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  }

  async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOneAndDelete(filter).exec();
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  }

  async deleteByCondition(filter: FilterQuery<T>) {
    return this.model.deleteMany(filter);
  }

  async findOneAndUpdate(filter: FilterQuery<T>, update: any) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, update, { upsert: true, new: true }).exec();
  }

  async updateMany(filter: FilterQuery<T>, update: any, option?: any | null): Promise<any> {
    return this.model.updateMany(filter, update, option).exec();
  }
  

  async findByIdAndUpdate(id: any, update: any) {
    return this.model.findByIdAndUpdate(id, update, { upsert: true, new: true }).exec();
  }
}
