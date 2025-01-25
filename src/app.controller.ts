import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'File is required',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const response = await this.appService.uploadImage({ file: file });

    if (!response.data) {
      this.logger.error(
        `something wrong when try to upload image, error: ${response.error}`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed Image Upload',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.data;
  }
}
