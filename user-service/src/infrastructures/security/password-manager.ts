import { hash, verify } from 'argon2';

export class Argon2PasswordManager {
  public static async hash(password: string): Promise<string> {
    return hash(password);
  }

  public static async verify(hash: string, password: string): Promise<boolean> {
    return verify(hash, password);
  }
}
