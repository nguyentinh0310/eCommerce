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
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
