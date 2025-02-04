import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { UserMongo } from '../../../src/modules/user/infrastructure/mongoDb/user.schema';
import { User } from '../../../src/modules/user/domain/user.entity';
import { UserService } from '../../../src/modules/user/application/user.service';

export async function createUser(
  userModel: Model<UserMongo>,
  overrides: Partial<User>,
): Promise<UserMongo> {
  const userService = new UserService();
  const user = {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const userData = {
    ...user,
    ...overrides,
  };

  userData.password = await userService.hashedPassword(userData.password);

  const createdUser = await userModel.create(userData);
  return createdUser;
}
