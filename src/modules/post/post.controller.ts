//src/modules/post/post.controller.ts
import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { PostService } from './post.service.js';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Obtener todos los posts
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  // Crear post (requiere id_esp, multimedia opcional)
  @Post()
  async create(@Body() body: { titulo: string; texto: string; tipo?: string; id_esp: number; multimedia?: string[] }) {
    // id_esp debe venir del token en producción
    return this.postService.createPost({
      titulo: body.titulo,
      texto: body.texto,
      tipo: body.tipo || 'normal', // Default a 'normal' si no se especifica
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

  // Obtener investigaciones de un especialista específico
  @Get('investigaciones/especialista/:id_esp')
  getInvestigacionesByEspecialista(@Param('id_esp') id_esp: number) {
    return this.postService.getInvestigacionesByEspecialista(Number(id_esp));
  }

  // Obtener participantes (usuarios que dieron "me interesa") de una investigación
  @Get(':id/participantes')
  getParticipantesInvestigacion(@Param('id') id: number) {
    return this.postService.getParticipantesInvestigacion(Number(id));
  }

  // Top posts con más likes (general)
  @Get('stats/top-liked')
  getTopLiked() {
    return this.postService.getTopLiked(10);
  }

  // Top posts con más likes por especialista
  @Get('stats/top-liked/:id_esp')
  getTopLikedByEspecialista(@Param('id_esp') id_esp: number) {
    return this.postService.getTopLikedByEspecialista(Number(id_esp), 10);
  }
}