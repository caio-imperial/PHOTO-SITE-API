import { Module } from '@nestjs/common';
import { UserRepositoryMongoDb } from './infrastructure/mongoDb/user.repository';
import { UserService } from './application/user.service';
import { UserController } from './infrastructure/user.controller';
import { UserCreateUseCase } from './application/useCases/userCreate.useCase';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/mongoDb/user.schema';
import { DatabaseModule } from '../database/database.module';
import { UserGetUseCase } from './application/useCases/userGet.useCase';
import { UserUpdateUseCase } from './application/useCases/user-update.use-case';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    UserService,
    UserCreateUseCase,
    UserGetUseCase,
    UserUpdateUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryMongoDb,
    },
  ],
  controllers: [UserController],
  exports: ['UserRepository'],
})
export class UserModule {}
