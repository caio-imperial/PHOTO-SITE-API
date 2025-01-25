import { Inject, Injectable } from '@nestjs/common';
import { StorageStrategy } from './interfaces/storage.interface';
import { UploadFileDTO } from './application/dto/upload-file.dto';
import { OutputFileDTO } from './application/dto/output-file.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StorageService {
  constructor(
    @Inject('StorageStrategy') private readonly strategy: StorageStrategy,
  ) {}

  async uploadImage(uploadFile: UploadFileDTO): Promise<OutputFileDTO> {
    return plainToInstance(
      OutputFileDTO,
      await this.strategy.uploadImage(uploadFile),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
