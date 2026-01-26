import z from 'zod';

export class UserSchema {
  public static readonly create = z.strictObject({
    name: z.string().trim().min(4),
    username: z.string().trim().min(4),
    email: z.email().trim(),
    password: z.string().trim().min(8),
  });
}
