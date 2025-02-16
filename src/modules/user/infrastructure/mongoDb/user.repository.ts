import { Injectable, Logger } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { UserRepository } from '../../domain/user.repository';
import { UserMongo } from './user.schema';
import { User } from '../../domain/user.entity';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { Transaction } from '../../../../modules/database/domain/trasaction-manager.repository';

@Injectable()
export class UserRepositoryMongoDb implements UserRepository {
  private readonly logger = new Logger(UserRepositoryMongoDb.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserMongo>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    transaction: Transaction | null = null,
  ) {
    this.logger.log('Creating User in DB');
    const session = transaction
      ? (transaction.getSession() as ClientSession)
      : undefined;

    const newUser = await this.userModel.create([createUserDto], { session });

    this.logger.log('Created User in DB');

    return this.convertToEntity(newUser[0]);
  }
  async getById(id: string, transaction: Transaction | null = null) {
    this.logger.log('Searching User in DB');

    const session = transaction
      ? (transaction.getSession() as ClientSession)
      : undefined;

    const user = await this.userModel.findById(id).session(session).exec();

    if (!user) {
      this.logger.log('Not found User in DB');
      return null;
    }

    this.logger.log('Found User in DB');
    return this.convertToEntity(user);
  }

  async getByEmail(email: string, transaction: Transaction | null = null) {
    this.logger.log('Searching User in DB');

    const session = transaction
      ? (transaction.getSession() as ClientSession)
      : undefined;

    const user = await this.userModel
      .findOne({ email: email })
      .session(session)
      .exec();

    if (!user) {
      this.logger.log('Not found User in DB');
      return;
    }

    this.logger.log('Found User in DB');
    return this.convertToEntity(user);
  }

  async findAll(transaction: Transaction | null = null) {
    this.logger.log('Searching Users in DB');

    const session = transaction
      ? (transaction.getSession() as ClientSession)
      : undefined;

    const users = await this.userModel.find().session(session).exec();

    if (!(users.length > 0)) {
      this.logger.log('Not found Users in DB');
      return;
    }

    this.logger.log('Found Users in DB');
    return users.map(this.convertToEntity);
  }

  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
    transaction: Transaction | null = null,
  ): Promise<User> {
    this.logger.log('Updating User in DB');

    const session = transaction
      ? (transaction.getSession() as ClientSession)
      : undefined;

    const userUpdated = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .session(session)
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
