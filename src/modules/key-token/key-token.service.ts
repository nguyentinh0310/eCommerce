import { Injectable } from '@nestjs/common';
import { KeyTokenRepository } from './key-token.repository';

@Injectable()
export class KeyTokenService {
  constructor(private readonly keyTokenRepository: KeyTokenRepository) {}

  async createKeyToken({ userId, publicKey, privateKey }: { userId: any; publicKey: string, privateKey: string }) {
    const tokens = await this.keyTokenRepository.create({
      user: userId,
      publicKey,
      privateKey
    });
    return tokens ? tokens.publicKey : null;
  }
}
