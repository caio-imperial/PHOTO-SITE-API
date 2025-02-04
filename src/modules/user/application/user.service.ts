import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private readonly saltRounds = 10;

  async hashedPassword(password: string): Promise<string> {
    this.logger.log('Encrypting Password');
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    this.logger.log('Password Encrypted');

    return hashedPassword;
  }
}
