import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@utils/base.repository';
import { KeyToken, KeyTokenDocument } from './key-token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class KeyTokenRepository extends BaseRepository<KeyTokenDocument> {
  constructor(
    @InjectModel(KeyToken.name)
    private readonly keyTokenModel: Model<KeyTokenDocument>,
  ) {
    super(keyTokenModel);
  }
}
