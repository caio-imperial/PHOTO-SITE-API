import { Injectable } from '@nestjs/common';
import { Connection, ClientSession } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Transaction } from '../../domain/trasaction-manager.repository';

@Injectable()
export class MongooseTransactionManager implements Transaction {
  private session: ClientSession | null = null;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async start(): Promise<void> {
    this.session = await this.connection.startSession();
    this.session.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this.session) throw new Error('Transaction not started');
    await this.session.commitTransaction();
    this.session.endSession();
  }

  async rollback(): Promise<void> {
    if (!this.session) throw new Error('Transaction not started');
    await this.session.abortTransaction();
    this.session.endSession();
  }

  getSession(): ClientSession {
    if (!this.session) throw new Error('Transaction not started');
    return this.session;
  }
}
