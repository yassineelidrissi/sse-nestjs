import { Controller, Req, Sse } from '@nestjs/common';
import { from } from 'rxjs';
import { NotificationStreamService } from 'src/notification/providers/notification-stream.service';

@Controller('notification')
export class NotificationController {

    constructor(
        private readonly notificationStreamService: NotificationStreamService
    ) {}


    @Sse('stream')
    stream(@Req() req) {
        const userId = +req.query.userId;
        const generator = this.notificationStreamService.stream(userId);
        return from(generator);
    }


}
