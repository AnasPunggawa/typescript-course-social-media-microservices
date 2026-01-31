import { model, Schema } from 'mongoose';

import type { RefreshTokenStored } from '@common/types/refresh-token.type';

const RefreshTokenSchema = new Schema<RefreshTokenStored>(
  {
    token: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

RefreshTokenSchema.index({ token: 'text' });

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 5 });

export const RefreshToken = model<RefreshTokenStored>(
  'RefreshToken',
  RefreshTokenSchema,
);
