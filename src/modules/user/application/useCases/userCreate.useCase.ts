import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../user.service';
import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';

export class UserCreateUseCase {
  private readonly logger = new Logger(UserCreateUseCase.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Checking if user exist');
    const hasUser = await this.userRepository.getByEmail(createUserDto.email);

    if (hasUser) {
      this.logger.error('User aready exist');
      throw new BadRequestException();
    }

    this.logger.log('Start to Encrypt User Password');
    const hashedPassword = await this.userService.hashedPassword(
      createUserDto.password,
    );
    this.logger.log('Start to create User in DB');
    return this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
