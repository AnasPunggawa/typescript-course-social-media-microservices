import { model, Schema } from 'mongoose';
import type { UserStored } from '../common/types/user.type';

const UserSchema = new Schema<UserStored>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      minLength: 4,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
      minLength: 4,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
        'Invalid email value',
      ],
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    createdAt: {
      type: Schema.Types.Date,
    },
    updatedAt: {
      type: Schema.Types.Date,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ username: 'text' });

export const User = model<UserStored>('User', UserSchema);
