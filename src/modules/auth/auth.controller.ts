import {
  Body,
  Controller, HttpCode, Post, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'decorators/permissions.decorator';
import { PermisstionGuard } from 'guard/permission.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(PermisstionGuard)
  // @Permissions('0000')
  @Post('register')
  async register(@Body() userDto: RegisterDto): Promise<any>{
    return await this.authService.register(userDto)
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() userDto: LoginDto): Promise<any>{
    return await this.authService.login(userDto)
  }
}
