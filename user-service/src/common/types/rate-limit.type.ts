export type Limiter = 'register' | 'login' | 'refresh' | 'logout' | 'auth';

export type RateLimitRedisConfig = {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration: number;
};
