import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { UserRepository } from '../../domain/user.repository';
import { UserMongo } from './user.schema';
import { User } from '../../domain/user.entity';

@Injectable()
export class UserRepositoryMongoDb implements UserRepository {
  private readonly logger = new Logger(UserRepositoryMongoDb.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserMongo>,
  ) {}

  async createUser(createUserDto) {
    this.logger.log('Creating User in DB');
    const user = new this.userModel(createUserDto);

    const newUser = await user.save();
    this.logger.log('Created User in DB');

    return this.convertToEntity(newUser);
  }
  async getById(id) {
    this.logger.log('Searching User in DB');
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.log('Not found User in DB');
      return;
    }

    this.logger.log('Found User in DB');
    return this.convertToEntity(user);
  }

  async getByEmail(email: string) {
    this.logger.log('Searching User in DB');
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      this.logger.log('Not found User in DB');
      return;
    }
    this.logger.log('Found User in DB');
    return this.convertToEntity(user);
  }

  async findAll() {
    this.logger.log('Searching Users in DB');
    const users = await this.userModel.find().exec();

    if (!(users.length > 0)) {
      this.logger.log('Not found User in DB');
      return;
    }

    this.logger.log('Found Users in DB');
    return users.map(this.convertToEntity);
  }

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log('Updating User in DB');
    const userUpdated = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();

    if (!userUpdated) {
      this.logger.log('Fail to update User in DB');
      return;
    }

    this.logger.log('Updated User in DB');
    return this.convertToEntity(userUpdated);
  }

  private convertToEntity(userDocument: UserMongo): User {
    return new User(
      userDocument._id.toString(),
      userDocument.name,
      userDocument.lastName,
      userDocument.email,
      userDocument.password,
      userDocument.createdAt,
      userDocument.updatedAt,
      userDocument.deletedAt,
    );
  }
}
