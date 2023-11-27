import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guard/jwt-auth.guard';
import { RequestWithUser } from 'types/auth.types';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: RegisterDto): Promise<any> {
    return await this.authService.register(userDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() userDto: LoginDto): Promise<any> {
    return await this.authService.login(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req: RequestWithUser): Promise<any> {
    return await this.authService.logout(req.user.id);
  }

  @Post('refresh-token')
  @HttpCode(200)
  async handleRefreshToken(@Body('refreshToken') refreshToken: string): Promise<any> {
    return await this.authService.handleRefreshToken(refreshToken);
  }
}
