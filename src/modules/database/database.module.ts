import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDbConstants } from './constants/mongoDb.constant';

@Module({
  imports: [MongooseModule.forRoot(mongoDbConstants.uri)],
  providers: [DatabaseService],
})
export class DatabaseModule {}
