import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPublicPresentations } from './presentations/user-public.presentations';
import { UserCreateUseCase } from '../application/useCases/userCreate.useCase';
import { Public } from '../../auth/application/decorators/public.decorator';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UserGetUseCase } from '../application/useCases/userGet.useCase';
import { UserNotFoundException } from '../domain/exceptions/userNotFound.exception';
import { InvalidInputException } from '../domain/exceptions/invalidInput.exception';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userCreateUseCase: UserCreateUseCase,
    private readonly userGetUseCase: UserGetUseCase,
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

  // @Get()
  // async showUsers(): Promise<ResponseUserDto[]> {
  //   this.logger.log('start list user');
  //   this.logger.log('return all user');
  //   return plainToInstance(ResponseUserDto, await this.userService.findAll(), {
  //     excludeExtraneousValues: true,
  //   });
  // }

  // @Put(':id')
  // async updateUsers(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<ResponseUserDto> {
  //   this.logger.log('start to update user');
  //   if (!updateUserDto.name && !updateUserDto.lastName) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //         message: 'Body cannot be empty',
  //       },
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }

  //   this.logger.log('return user updated');
  //   return plainToInstance(
  //     ResponseUserDto,
  //     await this.userService.updateById(id, updateUserDto),
  //     {
  //       excludeExtraneousValues: true,
  //     },
  //   );
  // }
}
