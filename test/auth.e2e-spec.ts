import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthController } from '../src/modules/auth/infrastructure/auth.controller';
import { startMongo } from './global-setup';
import { AppModule } from '../src/modules/app.module';
import { UserMongo } from '../src/modules/user/infrastructure/mongoDb/user.schema';
import { User } from '../src/modules/user/domain/user.entity';
import { createUser } from './factories/mongo-db/user.factory';
import { SignInDto } from '../src/modules/auth/application/dto/signIn.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let controller: AuthController;
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

    controller = module.get<AuthController>(AuthController);
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

  it('/auth/profile (GET) - Get user', async () => {
    const userLogin = await loginUser();

    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${userLogin.accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('exp');
        expect(res.body).toHaveProperty('iat');
        expect(res.body).toHaveProperty('sub');
        expect(res.body).toHaveProperty('username');
      });
  });

  it('/auth/login (POST) - User login', async () => {
    const user = await createUser(userModel, {
      password: 'myPassw0rd!',
    });

    const signInDto: SignInDto = {
      email: user.email,
      password: 'myPassw0rd!',
    };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(signInDto)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });
});
