import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { PostsService } from 'src/posts/posts.service';

@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService
    ) {}


    @Post(':userId')
    public createPost(@Body() createPostDto: CreatePostDto, @Param('userId', ParseIntPipe) userId: number) {
        return this.postsService.createPost(createPostDto, userId);
    }


}
