import { NotificationType } from "src/notification/types/notification-type.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'enum',
        enum: NotificationType
    })
    type: NotificationType;

    @Column('jsonb')
    payload: any;

    @Column({
        type: 'boolean',
        default: false
    })
    isRead: boolean;

    @Column({
        type: 'int'
    })
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
}