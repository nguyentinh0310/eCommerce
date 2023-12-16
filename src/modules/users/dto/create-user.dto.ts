import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  constructor(email: string, name: string, password: string, roles: string[]) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.roles = roles;
  }
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  roles: string[];
}
