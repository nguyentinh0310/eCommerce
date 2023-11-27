import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from '@enums/role.enum';
import { KeyTokenService } from '@modules/key-token/key-token.service';
import { createTokenKeyPair } from '@utils/auth';
import { getInfoData } from '@utils/common';
import { ObjectId } from 'mongoose';
import { env } from 'process';

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
          this.jwtService,
          publicKey,
          privateKey,
        );

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Register successfully!',
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

  async login(loginDto: LoginDto) {
    try {
      const { email, password, refreshToken } = loginDto;
      // kiểm tra email tồn tại
      const foundShop = await this.userService.getByEmail(email);
      if (!foundShop)
        throw new HttpException('Email is not exist!', HttpStatus.BAD_REQUEST);
      // match password
      const isMatchPassword = await bcrypt.compare(
        password,
        foundShop.password,
      );
      if (!isMatchPassword)
        throw new HttpException('Incorrect password!', HttpStatus.BAD_REQUEST);
      // tạo accessToken và refreshToken lưu vào db
      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');
      // generate token
      const tokens = await createTokenKeyPair(
        { userId: foundShop._id, email },
        this.jwtService,
        publicKey,
        privateKey,
      );

      const keyStore = await this.keyTokenService.createKeyToken({
        userId: foundShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });
      if (!keyStore)
        throw new HttpException('keyStore error', HttpStatus.BAD_REQUEST);

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successfully!',
        meta: {
          shop: getInfoData({
            fileds: ['_id', 'name', 'email'],
            object: foundShop,
          }),
          tokens,
        },
      };
      // get data return login
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: ObjectId) {
    try {
      const keyStore = await this.keyTokenService.findByUserId(userId);
      if (!keyStore)
        throw new HttpException('Not found keyStore', HttpStatus.NOT_FOUND);

      const delKey = await this.keyTokenService.removeKeyById(keyStore._id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Logout successfully!',
        meta: delKey,
      };
    } catch (error) {
      throw error;
    }
  }

  async handleRefreshToken(refreshToken: string) {
    try {
      // Kiểm tra có phải user đó ko?
      const decode = this.jwtService.verify(refreshToken, {
        secret: env.SECRETKEY_REFRESH,
      });
      const userId = decode.userId
      if (!userId)
        throw new HttpException('Invalid UserId', HttpStatus.UNAUTHORIZED);
      
      // get keyStore
        const keyStore = await this.keyTokenService.findByUserId(userId);
      if (!keyStore)
        throw new HttpException('Not found keyStore', HttpStatus.NOT_FOUND);


      // Kiểm tra refresh token đã tồn tại
      if (keyStore.refreshTokenUsed.includes(refreshToken)) {
        // await this.keyTokenService.removeKeyById(keyStore._id);
        throw new HttpException(
          'Something wrong happen!! Please login',
          HttpStatus.FORBIDDEN,
        );
      }

      // Kiểm tra refresh token
      if (keyStore.refreshToken !== refreshToken)
        throw new HttpException(
          'Incorrect refresh token',
          HttpStatus.UNAUTHORIZED,
        );

      const foundShop = await this.userService.getByUserId(userId);
      if (!foundShop)
        throw new HttpException(
          'Shop not registerted',
          HttpStatus.UNAUTHORIZED,
        );

      // Tạo token mới
      const tokens = await createTokenKeyPair(
        { userId, email: foundShop.email },
        this.jwtService,
        keyStore.publicKey,
        keyStore.privateKey,
      );

      // Cập nhật refresh token và thêm token cũ vào mảng refreshTokenUsed
      await keyStore.updateOne({
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokenUsed: refreshToken,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'RefreshToken successfully!',
        meta: {
          user: foundShop,
          tokens,
        },
      };
    } catch (error) {
      console.error(error)
      if (error instanceof JsonWebTokenError) {
        throw new HttpException('Invalid refreshToken', HttpStatus.UNAUTHORIZED);
      }
      throw error;
    }
  }

  async validateUser(userId: ObjectId) {
    try {
      const user = await this.userService.getByUserId(userId);
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
