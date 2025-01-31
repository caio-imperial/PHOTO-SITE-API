import { Inject, Logger } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/userNotFound.exception';
import { InvalidInputException } from '../../domain/exceptions/invalidInput.exception';

export class UserGetUseCase {
  private readonly logger = new Logger(UserGetUseCase.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    this.logger.log('Start to get User');
    if (!userId) {
      this.logger.error(`invalid userId: ${userId}`);
      throw new InvalidInputException('Invalid input: userId required');
    }

    this.logger.log('Search User in DB');
    const user = this.userRepository.getById(userId);

    if (!user) {
      this.logger.error('Not found user in DB');
      throw new UserNotFoundException();
    }

    this.logger.log('Found User');
    return user;
  }
}
