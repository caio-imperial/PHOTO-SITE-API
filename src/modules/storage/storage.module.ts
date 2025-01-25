import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { HttpModule } from '@nestjs/axios';
import { IMGBBStrategy } from './strategies/imgbb.strategy';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    StorageService,
    {
      provide: 'StorageStrategy',
      useClass: IMGBBStrategy,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
