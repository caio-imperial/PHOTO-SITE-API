import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ImageSizesDTO } from './image.dto';

export class FileErrorDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  message: string;
}

class FileDTO {
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
  url: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  mime: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  extension: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  time: number;

  @Expose()
  @IsNotEmpty()
  @Type(() => ImageSizesDTO)
  image: ImageSizesDTO;
}

export class OutputFileDTO {
  @Expose()
  @IsOptional()
  @Type(() => FileDTO)
  data?: FileDTO;

  @Expose()
  @IsOptional()
  @Type(() => FileErrorDTO)
  error?: FileErrorDTO;
}
