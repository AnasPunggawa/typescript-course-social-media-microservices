export type Limiter = 'create' | 'get-posts';

export type RateLimitRedisConfig = {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration: number;
};
