import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CachesService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, expire?: number): Promise<'OK'> {
    return await this.redis.set(key, value, 'EX', expire ?? 10);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }
}
