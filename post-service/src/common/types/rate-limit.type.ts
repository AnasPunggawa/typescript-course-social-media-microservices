export type Limiter = 'create';

export type RateLimitRedisConfig = {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration: number;
};
