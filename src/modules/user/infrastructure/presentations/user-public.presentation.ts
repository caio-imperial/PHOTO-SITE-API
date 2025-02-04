import { Expose, plainToInstance } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../domain/user.entity';

export class UserPublicPresentations {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;

  @Expose()
  @IsDateString()
  deletedAt?: Date;

  from(userPublicPresentations: User) {
    return plainToInstance(UserPublicPresentations, userPublicPresentations, {
      excludeExtraneousValues: true,
    });
  }
}
