import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './application/dto/create-user.dto';
import { ResponseUserDto } from './application/dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './application/dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(201)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return plainToInstance(
      ResponseUserDto,
      await this.userService.create(createUserDto),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Get(':id')
  async getUserById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<ResponseUserDto> {
    this.logger.log('get user');
    this.logger.log('return user');
    return plainToInstance(
      ResponseUserDto,
      await this.userService.getById(id),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Get()
  async showUsers(): Promise<ResponseUserDto[]> {
    this.logger.log('start list user');
    this.logger.log('return all user');
    return plainToInstance(ResponseUserDto, await this.userService.findAll(), {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  async updateUsers(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    this.logger.log('start to update user');
    if (!updateUserDto.name && !updateUserDto.lastName) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Body cannot be empty',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.logger.log('return user updated');
    return plainToInstance(
      ResponseUserDto,
      await this.userService.updateById(id, updateUserDto),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
