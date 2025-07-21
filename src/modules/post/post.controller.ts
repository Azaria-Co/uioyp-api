import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service.js';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findById(id);
  }
}