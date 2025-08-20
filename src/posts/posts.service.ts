import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        private readonly usersService: UsersService
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

            return savedPost;

        } catch (error) {
            this.logger.error(`Failed to create post: ${error.message}`, error.stack);
            throw error;
        }
        
    }


}
