import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return await this.userRepository.findAll();
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async getByUserId(userId: ObjectId) {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user)
      throw new HttpException('User does not found', HttpStatus.BAD_REQUEST);
    return user
  }

  async create(userDto: CreateUserDto): Promise<UserDocument> {
    return await this.userRepository.create(userDto);
  }

  async update(userId: ObjectId, userData: UpdateUserDto) {
    const user = await this.getByUserId(userId)
    if (!user) {
      throw new HttpException('User does not found', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.findByIdAndUpdate(userId, userData)
  }

  async remove(userId: ObjectId): Promise<any> {
    const user = await this.getByUserId(userId);
    if (user.id === userId) {
      throw new HttpException(
        'You are not allowed to delete yourself',
        HttpStatus.FORBIDDEN,
      );
    }
  
    return await this.userRepository.deleteByCondition({ _id: userId });
  }
}
