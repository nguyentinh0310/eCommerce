import { ApiKeyService } from '@modules/api-key/api-key.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  protected apiKeyService: ApiKeyService; // Change private to protected

  constructor(apiKeyService: ApiKeyService) {
    this.apiKeyService = apiKeyService;
  }
  // CanActivate: có được phép truy cập tài nguyên hay không -> true || false
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra quyền của người dùng
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) return false;

    const isValidApiKey = await this.apiKeyService.validateApiKey(apiKey);
    return isValidApiKey;
  }
}
