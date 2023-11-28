import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  constructor(email: string, name: string, password: string, roles: string[]) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.roles = roles;
  }
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  roles?: string[];
}

export class LoginDto {
  constructor(email: string, password: string, refreshToken: string) {
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
  }
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  refreshToken?: string;
}

export class RefreshTokenDto {
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
  @ApiProperty()
  refreshToken: string;
}
