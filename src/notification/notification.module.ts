import { Module } from '@nestjs/common';
import { NotificationService } from './providers/notification.service';
import { NotificationController } from './notification.controller';
import { RedisAdapter } from 'src/notification/redis/redis-adapter';
import { StreamRegistry } from 'src/notification/stream/stream-registry';

@Module({
  providers: [NotificationService, RedisAdapter, StreamRegistry],
  controllers: [NotificationController],
})
export class NotificationModule {}
