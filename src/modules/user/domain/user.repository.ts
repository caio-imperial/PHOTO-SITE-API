import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { User } from './user.entity';

export abstract class UserRepository {
  abstract createUser(createUserDto: CreateUserDto): Promise<User>;
  abstract getById(id: string): Promise<User | undefined>;
  abstract getByEmail(email: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract updateById(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}
