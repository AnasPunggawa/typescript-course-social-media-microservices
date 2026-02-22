import { Types } from 'mongoose';
import z from 'zod';

export class UserSchema {
  public static readonly register = z.strictObject({
    name: z.string().trim().min(4).max(255),
    username: z.string().trim().min(4).max(50),
    email: z.email().trim().max(100),
    password: z.string().trim().min(8).max(100),
  });

  public static readonly login = UserSchema.register.pick({
    username: true,
    password: true,
  });

  public static readonly id = z
    .string({ error: 'Invalid user id' })
    .refine((val) => Types.ObjectId.isValid(val), {
      error: 'Invalid user id',
    })
    .transform((val) => new Types.ObjectId(val));
}
