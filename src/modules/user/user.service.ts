import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database/schemas/user.schema';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private readonly saltRounds = 10;

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Start to create User');

    this.logger.log('Encrypting Password');
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );
    this.logger.log('Password Encrypted');

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    this.logger.log('User Created');
    return createdUser.save();
  }

  async getById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async getByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();
  }

  async updateEmailById(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();
  }
}
