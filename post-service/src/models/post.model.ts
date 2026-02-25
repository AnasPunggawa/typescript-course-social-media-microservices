import { model, Schema } from 'mongoose';

import type { PostStored } from '@common/types/post.type';

const PostSchema = new Schema<PostStored>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // index: true,
    },
    content: {
      type: Schema.Types.String,
      minLength: 1,
      maxLength: 1500,
      required: true,
    },
    mediaUrls: [Schema.Types.String],
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ user: 1, createdAt: -1 });

PostSchema.index({ content: 'text' });

export const Post = model<PostStored>('Post', PostSchema);
