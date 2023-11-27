import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@utils/base.repository';
import { ApiKey, ApiKeyDocument } from './api-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ApiKeyRepository extends BaseRepository<ApiKeyDocument> {
  constructor(
    @InjectModel(ApiKey.name)
    private readonly apiKeyModel: Model<ApiKeyDocument>,
  ) {
    super(apiKeyModel);
  }
}
