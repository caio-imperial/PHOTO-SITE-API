import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ResponseUserDto {
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
}
