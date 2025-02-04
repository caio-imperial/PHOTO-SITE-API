import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPublicPresentations } from './presentations/user-public.presentation';
import { UserCreateUseCase } from '../application/useCases/userCreate.useCase';
import { Public } from '../../auth/application/decorators/public.decorator';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UserGetUseCase } from '../application/useCases/userGet.useCase';
import { UserNotFoundException } from '../domain/exceptions/userNotFound.exception';
import { InvalidInputException } from '../domain/exceptions/invalidInput.exception';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { UserUpdateUseCase } from '../application/useCases/user-update.use-case';

@Controller('user')
export class UserController {
  constructor(
    private readonly userCreateUseCase: UserCreateUseCase,
    private readonly userGetUseCase: UserGetUseCase,
    private readonly userUpdateUseCase: UserUpdateUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(201)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserPublicPresentations> {
    const userPublicPresentations = new UserPublicPresentations();
    return userPublicPresentations.from(
      await this.userCreateUseCase.execute(createUserDto),
    );
  }

  @Get()
  async getUserById(@Request() req): Promise<UserPublicPresentations> {
    try {
      const user = await this.userGetUseCase.execute(req.currentUser.sub);

      const userPublicPresentations = new UserPublicPresentations();
      return userPublicPresentations.from(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidInputException) {
        throw new UnauthorizedException();
      }
    }
  }

  @Put()
  async updateUsers(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublicPresentations> {
    if (!updateUserDto.name && !updateUserDto.lastName) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Body cannot be empty',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return plainToInstance(
      UserPublicPresentations,
      await this.userUpdateUseCase.execute(req.currentUser.sub, updateUserDto),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
