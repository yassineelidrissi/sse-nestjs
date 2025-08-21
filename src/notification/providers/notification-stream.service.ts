import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/providers/notification.service';
import { StreamRegistry } from 'src/notification/stream/stream-registry';

type DomainEvent = { 
    id?: number | string; 
    type?: string; 
    payload?: unknown 
};

@Injectable()
export class NotificationStreamService {

    private readonly logger = new Logger(NotificationStreamService.name);

    constructor(
        private readonly notificationService: NotificationService,
        private readonly streamRegistry: StreamRegistry
    ) {}

    public async *stream(userId: number): AsyncGenerator<any> {

        const backlogs = await this.notificationService.getBacklog(userId);

        for (const notif of backlogs) {
            const formatted = this.format(notif);
            if (formatted) yield formatted;
        }

        const liveStream = this.streamRegistry.createStream(userId);

        try {
            for await (const msg of liveStream) {
                const formatted = this.format(msg as DomainEvent);
                if (formatted) yield formatted;
            }
        } finally {
            this.streamRegistry.remove(userId);
        }
    }

    public format(event: DomainEvent) {

        if (!event?.id || !event?.type || event.payload === undefined) {
            this.logger.warn('[NotificationStream] Invalid event received', event);
            return;
        }

        return {
            id: String(event.id),
            event: event.type,
            data: JSON.stringify(event.payload),
        };

    }
}

