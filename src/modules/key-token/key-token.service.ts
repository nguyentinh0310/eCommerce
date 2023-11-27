import { Injectable } from '@nestjs/common';
import { KeyTokenRepository } from './key-token.repository';
import { ObjectId } from 'mongoose';

interface IKeyToken {
  userId: ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken?: string;
}
@Injectable()
export class KeyTokenService {
  constructor(private readonly keyTokenRepository: KeyTokenRepository) {}

  async createKeyToken(keyToken: IKeyToken) {
    try {
      const { userId, publicKey, privateKey, refreshToken } = keyToken;
      /**
      // C1: Lưu thẳng token vào db
      const tokens = await this.keyTokenRepository.create({
        user: userId,
        publicKey,
        privateKey
      });
    */
      // C2
      const tokens = await this.keyTokenRepository.findOneAndUpdate(
        { user: userId },
        {
          publicKey,
          privateKey,
          refreshToken,
          refreshTokenUsed: [],
        },
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: ObjectId) {
    return await this.keyTokenRepository.findByCondition({ user: userId });
  }

  async removeKeyById(id: any) {
    return await this.keyTokenRepository.deleteOne(id)
  }
}
