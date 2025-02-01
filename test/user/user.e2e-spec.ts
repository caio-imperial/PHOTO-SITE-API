import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../../src/modules/user/infrastructure/user.controller';
import { UserService } from '../../src/modules/user/application/user.service';
import { UserCreateUseCase } from '../../src/modules/user/application/useCases/userCreate.useCase';
import { UserGetUseCase } from '../../src/modules/user/application/useCases/userGet.useCase';
import { UserRepositoryMongoDb } from '../../src/modules/user/infrastructure/mongoDb/user.repository';
import { CreateUserDto } from '../../src/modules/user/application/dto/create-user.dto';
import { UserSchema } from '../../src/modules/user/infrastructure/mongoDb/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { startMongo } from '../../test/global-setup';
import mongoose from 'mongoose';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let controller: UserController;
  let uri: string;

  const startMongoContainer = startMongo();
  beforeEach(async () => {
    const mongoContainer = startMongoContainer.mongoContainer;
    const dbName = `test-user-${Math.random().toString(36).substring(7)}`;
    uri = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017).toString()}/${dbName}`;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        UserCreateUseCase,
        UserGetUseCase,
        {
          provide: 'UserRepository',
          useClass: UserRepositoryMongoDb,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const connMongoose = await mongoose.connect(uri);
    if (connMongoose.connection.readyState === 1) {
      await connMongoose.connection.dropDatabase();
      await connMongoose.connection.close();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/user (POST) - Create new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'test',
      lastName: 'automation',
      email: 'test.automation@example.com',
      password: 'myPassw0rd!',
    };
    await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201);
  });
});
