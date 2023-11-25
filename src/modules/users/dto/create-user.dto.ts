import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
