import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPayloads } from 'src/notification/dtos/notification-payloads.dto';
import { Notification } from 'src/notification/notification.entity';
import { RedisAdapter } from 'src/notification/redis/redis-adapter';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {

    private readonly logger = new Logger(NotificationService.name);

    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly redisAdaper: RedisAdapter,
    ) {}


    public async send<K extends keyof NotificationPayloads>(userId: number, type: K, payload: NotificationPayloads[K]) {

        try {
            const notif = this.notificationRepository.create({
                type,
                payload,
                userId
            });
    
            const savedNotification = await this.notificationRepository.save(notif);
    
            await this.redisAdaper.publish({
                id: savedNotification.id,
                userId: savedNotification.userId,
                type: savedNotification.type,
                payload: savedNotification.payload,
            });
    
            this.logger.log(`Notification sent successfully to user ${userId}`);
            
            return savedNotification;

        } catch (error) {
            this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
            throw error;
        }

    }

    public async getBacklog(userId: number) {
        return await this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'ASC' },
            take: 100
        });
    }


}
