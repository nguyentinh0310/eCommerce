import { Injectable } from '@nestjs/common';
import { ApiKeyRepository } from './api-key.repository';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}
  async validateApiKey(key: string): Promise<boolean> {
    const newKey = await this.apiKeyRepository.create({
      key: crypto.randomBytes(64).toString('hex'),
      permissions: ['0000'],
    });
    console.log(newKey);
    const objKey = await this.apiKeyRepository.findByCondition({ key, status: true });
    // Nếu không tìm thấy khóa hoặc trạng thái không hợp lệ, trả về false
    if (!objKey || !objKey.status) {
      return false;
    }
    // Trả về true nếu khóa hợp lệ
    return true;
  }
  async hasPermissions(key: string, permissions: string[]): Promise<boolean> {
    const objKey = await this.apiKeyRepository.findByCondition({ key, status: true });
    if(!objKey) {
      return false
    }
    return objKey.permissions.some(permission => permissions.includes(permission))
  }
}
