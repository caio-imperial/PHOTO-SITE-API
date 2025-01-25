import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from './modules/storage/storage.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly storageService: StorageService) {}

  async uploadImage(file): Promise<any> {
    const response = await this.storageService.uploadImage(file);
    return response;
  }
}
