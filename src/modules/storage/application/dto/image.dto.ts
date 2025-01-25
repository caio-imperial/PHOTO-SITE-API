import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class ImageDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  mime: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  extension: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  url: string;
}

export class ImageSizesDTO {
  @Expose()
  @IsNotEmpty()
  @Type(() => ImageDTO)
  full: ImageDTO;

  @Expose()
  @IsNotEmpty()
  @Type(() => ImageDTO)
  medium: ImageDTO;

  @Expose()
  @IsNotEmpty()
  @Type(() => ImageDTO)
  thumb: ImageDTO;
}
