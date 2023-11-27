import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyAuthGuard } from './api-key.guard';
import { ApiKeyService } from '@modules/api-key/api-key.service';

@Injectable()
export class PermisstionGuard extends ApiKeyAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    apiKeyService: ApiKeyService,
  ) {
    super(apiKeyService);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateApiKey = super.canActivate(context);
    if (!canActivateApiKey) return false;
    // Lấy thông tin quyền từ decorator @Permissions
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!permissions || permissions.length === 0) return true;
    
    // Kiểm tra quyền của người dùng
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) return false;

    return this.apiKeyService.hasPermissions(apiKey, permissions);
  }
}
