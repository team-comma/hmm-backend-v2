import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { CachesService } from './caches.service';

@Module({
  imports: [RedisModule],
  providers: [CachesService],
  exports: [CachesService],
})
export class CachesModule {}
