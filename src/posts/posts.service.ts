import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/providers/notification.service';
import { NotificationType } from 'src/notification/types/notification-type.enum';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { Post } from 'src/posts/posts.entity';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {

    private readonly logger = new Logger(PostsService.name);

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly usersService: UsersService,
        private readonly notificationService: NotificationService
    ) {}


    public async createPost(createPostDto: CreatePostDto, userId: number) {

        try {
            const user = await this.usersService.getUserById(userId);
            this.logger.debug(`User validated: ${user.id}`);

            const post = this.postRepository.create({
                title: createPostDto.title,
                content: createPostDto.content,
                user: { id: userId },
            });

            const savedPost = await this.postRepository.save(post);
            this.logger.log(`Post created successfully with ID: ${savedPost.id}`);

            await this.notificationService.send(
                userId,
                NotificationType.PostCreated,
                {
                    title: savedPost.title,
                    content: savedPost.content
                }
            );

            return savedPost;

        } catch (error) {
            this.logger.error(`Failed to create post: ${error.message}`, error.stack);
            throw error;
        }
        
    }


}
