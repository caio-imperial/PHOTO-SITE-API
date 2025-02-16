import { Transaction } from '../../../modules/database/domain/trasaction-manager.repository';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { User } from './user.entity';

export abstract class UserRepository {
  abstract createUser(
    createUserDto: CreateUserDto,
    transaction?: Transaction | null,
  ): Promise<User>;
  abstract getById(
    id: string,
    session?: Transaction | null,
  ): Promise<User | undefined>;
  abstract getByEmail(
    email: string,
    session?: Transaction | null,
  ): Promise<User>;
  abstract findAll(session: Transaction | null): Promise<User[]>;
  abstract updateById(
    id: string,
    updateUserDto: UpdateUserDto,
    session?: Transaction | null,
  ): Promise<User>;
}
