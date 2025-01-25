import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileDTO {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsOptional()
  @IsString()
  name?: string;
}
