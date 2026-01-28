import z from 'zod';

export class UserSchema {
  public static readonly register = z.strictObject({
    name: z.string().trim().min(4),
    username: z.string().trim().min(4),
    email: z.email().trim(),
    password: z.string().trim().min(8),
  });

  public static readonly login = UserSchema.register.pick({
    username: true,
    password: true,
  });
}
