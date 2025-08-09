import * as bcrypt from 'bcrypt';
import { ServerError } from 'src/types';

export class Hasher {
  private static readonly SALT_ROUNDS = 12;

  static async hash(plainText: string): Promise<string> {
    try {
      return bcrypt.hash(plainText, Hasher.SALT_ROUNDS);
    } catch (e) {
      throw new ServerError('Failed to hash text', {
        reason: (e as Error).message,
      });
    }
  }

  static async compare(baseText: string, hashedText: string): Promise<boolean> {
    try {
      return bcrypt.compare(baseText, hashedText);
    } catch (e) {
      throw new ServerError('Failed to compare text', {
        reason: (e as Error).message,
      });
    }
  }
}
