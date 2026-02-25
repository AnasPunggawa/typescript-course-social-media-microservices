import { Types } from 'mongoose';
import z from 'zod';

export class PostSchema {
  public static readonly create = z.strictObject({
    user: z
      .string()
      .refine((value) => Types.ObjectId.isValid(value), {
        error: 'Invalid user id',
      })
      .transform((val) => new Types.ObjectId(val)),
    content: z.string().min(1).max(1500),
    mediaUrls: z.array(z.url()).default([]),
  });
}
