import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from '@enums/role.enum';
import { KeyTokenService } from '@modules/key-token/key-token.service';
import { createTokenKeyPair } from '@utils/auth';
import { getInfoData } from '@utils/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly keyTokenService: KeyTokenService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    try {
      const { email } = registerDto;
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // Kiểm tra email tồn tại
      const holderShop = await this.userService.getByEmail(email);
      if (holderShop)
        throw new HttpException(
          'Email already register',
          HttpStatus.BAD_REQUEST,
        );

      // Lưu shop vào colection users
      const newShop = await this.userService.create({
        ...registerDto,
        password: hashedPassword,
        roles: [Role.Shop],
      });
      if (newShop) {
        /**
         // Thuật toán RSA
         const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
           modulusLength: 4096, // kiểu mặc định của rsa
           publicKeyEncoding: {
             type: 'pkcs1', // publickey cryptography standard
             format: 'pem'
           },
           privateKeyEncoding: {
             type: 'pkcs1',
             format: 'pem'
           }
         });
        const publicKeyObj = crypto.createPublicKey(publicKeyString);
        */

        // tạo publicKey, privateKey
        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        // lưu vào colection keyToken
        const keyStore = await this.keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });
        if (!keyStore)
          throw new HttpException('keyStore error', HttpStatus.BAD_REQUEST);

        // tạo token pair
        const tokens = await createTokenKeyPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey,
        );

        return {
          statusCode: HttpStatus.CREATED,
          meta: {
            shop: getInfoData({
              fileds: ['_id', 'name', 'email'],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        statusCode: HttpStatus.OK,
        meta: null,
      };
    } catch (error) {
      throw error;
    }
  }
}
