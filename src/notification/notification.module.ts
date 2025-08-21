import { Module } from '@nestjs/common';
import { NotificationService } from './providers/notification.service';
import { NotificationController } from './notification.controller';
import { RedisAdapter } from 'src/notification/redis/redis-adapter';
import { StreamRegistry } from 'src/notification/stream/stream-registry';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/notification/notification.entity';
import { NotificationStreamService } from 'src/notification/providers/notification-stream.service';

@Module({
  providers: [NotificationService, RedisAdapter, StreamRegistry, NotificationStreamService],
  controllers: [NotificationController],
  imports: [TypeOrmModule.forFeature([Notification])],
  exports: [NotificationService]
})
export class NotificationModule {}
