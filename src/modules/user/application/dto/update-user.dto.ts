import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;
}
