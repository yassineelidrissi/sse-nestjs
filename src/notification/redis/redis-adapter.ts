import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { StreamRegistry } from "src/notification/stream/stream-registry";

@Injectable()
export class RedisAdapter implements OnModuleInit {

    private pub = new Redis({ host: 'redis' });
    private sub = new Redis({ host: 'redis' });

    constructor(
        private readonly streamRegistry: StreamRegistry
    ) {}


    async onModuleInit() {
        await this.sub.subscribe('notifications');
        this.sub.on('message', (_channel, raw) => {
            const notif = JSON.parse(raw);
            this.streamRegistry.push(notif.userId, notif);
        });
    }


    public publish(notif: any) {
        this.pub.publish('notifications', JSON.stringify(notif));
    }


}