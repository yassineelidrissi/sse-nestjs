import { Post } from "src/posts/posts.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    fullName: string;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
        unique: true
    })
    email: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}