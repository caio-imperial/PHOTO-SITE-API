import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseTransactionManager } from './infrastructure/mongoDb/mongoose-transation-manager.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URI'),
        retryAttempts: 5,
        retryDelay: 5000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [{ provide: 'Transaction', useClass: MongooseTransactionManager }],
  exports: ['Transaction'],
})
export class DatabaseModule {}
