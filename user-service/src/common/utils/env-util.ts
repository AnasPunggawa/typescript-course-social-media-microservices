import 'dotenv/config';
import { env } from 'node:process';

export class Env {
  public static required(name: string): string {
    const value = env[name];

    if (!value) {
      throw new Error(`${name} is undefined, please check the .env file`);
    }

    return value;
  }

  public static requiredNumber(name: string): number {
    const value = env[name];

    if (!value) {
      throw new Error(`${name} is undefined, please check the .env file`);
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
      throw new Error(`${name} must be a number, please check the .env file`);
    }

    return parsed;
  }

  public static optionalString(name: string, defaultValue: string): string {
    const value = env[name];

    return value ?? defaultValue;
  }

  public static optionalNumber(name: string, defaultValue: number): number {
    const value = Number(env[name]);

    return Number.isInteger(value) ? value : defaultValue;
  }

  public static optionalBoolean(name: string, defaultValue: boolean): boolean {
    const value = env[name];

    if (!value) {
      return defaultValue;
    }

    return value === 'true';
  }
}
