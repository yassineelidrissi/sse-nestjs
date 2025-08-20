import { NotificationType } from '../types/notification-type.enum';

export interface NotificationPayloads {
    [NotificationType.PostCreated]: {
        title: string;
        content: string;
    };
    [NotificationType.UserCreated]: {
        fullName: string;
        email: string;
    },
}
