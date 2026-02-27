export type Limiter = 'create' | 'get-posts' | 'get-post' | 'patch' | 'delete';

export type RateLimitRedisConfig = {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration: number;
};
