import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AppModule } from '../../src/modules/app.module';
import { UserController } from '../../src/modules/user/infrastructure/user.controller';
import { CreateUserDto } from '../../src/modules/user/application/dto/create-user.dto';
import { startMongo } from '../../test/global-setup';
import { UpdateUserDto } from '../../src/modules/user/application/dto/update-user.dto';
import { createUser } from '../factories/mongo-db/user.factory';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserMongo } from '../../src/modules/user/infrastructure/mongoDb/user.schema';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let controller: UserController;
  let uriBase: string;
  let uri: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let loginUser: Function;
  let userModel: Model<UserMongo>;

  const startMongoContainer = startMongo();
  beforeAll(async () => {
    const mongoContainer = startMongoContainer.mongoContainer;
    uriBase = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017).toString()}/`;
  });
  beforeEach(async () => {
    const dbName = `test-user-${Math.random().toString(36).substring(7)}`;
    uri = uriBase + dbName;

    process.env.MONGO_DB_URI = uri;

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<UserController>(UserController);
    userModel = module.get<Model<UserMongo>>(getModelToken(User.name));
    app = module.createNestApplication();
    await app.init();

    loginUser = async (): Promise<any> => {
      const user = await createUser(userModel, {
        password: 'myPassw0rd!',
      });
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'myPassw0rd!' });

      return {
        accessToken: response.body.accessToken,
        cleanPassword: 'myPassw0rd',
        ...user,
      };
    };
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
      name: 'testCreate',
      lastName: 'automation',
      email: 'test.automation@example.com',
      password: 'myPassw0rd!',
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('lastName');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
      });
  });

  it('/user (PUT) - Update new user', async () => {
    const userLogin = await loginUser();

    const updateUserDto: UpdateUserDto = {
      name: 'updatedUser',
      lastName: 'updatedUserLastName',
    };
    console.log(userLogin.accessToken);
    await request(app.getHttpServer())
      .put('/user')
      .set('Authorization', `Bearer ${userLogin.accessToken}`)
      .send(updateUserDto)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'updatedUser');
        expect(res.body).toHaveProperty('lastName', 'updatedUserLastName');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
      });
  });
});
