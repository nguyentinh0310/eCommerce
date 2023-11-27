import { env } from '@config/environment';
import { AuthService } from '@modules/auth/auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ObjectId } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  userId: ObjectId;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.SECRETKEY,
    });
  }

  async validate(payload: JwtPayload) {
    const { userId, email } = payload;

    const user = await this.authService.validateUser(userId);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
