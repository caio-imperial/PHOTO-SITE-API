import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

export class UserUpdateUseCase {
  private readonly logger = new Logger(UserUpdateUseCase.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log('Start update user');
    const user = await this.userRepository.updateById(userId, updateUserDto);

    if (!user) {
      this.logger.error('User not found');
      throw new NotFoundException();
    }

    this.logger.log('User updated');
    return user;
  }
}
