import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { PostService } from './post.service.js';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Crear post (requiere id_esp, multimedia opcional)
  @Post()
  async create(@Body() body: { titulo: string; texto: string; id_esp: number; multimedia?: string[] }) {
    // id_esp debe venir del token en producción
    return this.postService.createPost({
      titulo: body.titulo,
      texto: body.texto,
      id_esp: body.id_esp,
      multimedia: body.multimedia || [],
    });
  }

  // Eliminar post (requiere id del post y id_esp del token)
  @Delete(':id')
  async delete(@Param('id') id: number, @Body('id_esp') id_esp: number) {
    return this.postService.deletePost(Number(id), id_esp);
  }

  // Obtener un post por id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findById(id);
  }
}