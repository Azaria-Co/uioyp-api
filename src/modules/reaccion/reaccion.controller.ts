//src/modules/reaccion/reaccion.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { ReaccionService } from './reaccion.service.js';

@Controller('reacciones')
export class ReaccionController {
  constructor(private readonly reaccionService: ReaccionService) {}

  @Get()
  async findOne(
    @Query('id_us') id_us: number,
    @Query('id_post') id_post: number,
  ) {
    if (!id_us || !id_post) {
      // Retorna un JSON válido para evitar problemas
      return { exists: false };
    }
    const reaccion = await this.reaccionService.findByIds(id_us, id_post);
    return { exists: !!reaccion, reaccion };
  }

  @Get('count')
  async count(@Query('id_post') id_postStr: string) {
    const id_post = Number(id_postStr);
    if (isNaN(id_post)) {
      return { count: 0 }; // O lanza BadRequestException si prefieres
    }
    const count = await this.reaccionService.countByPost(id_post);
    return { count };
  }

  @Post()
  create(@Body() body: { id_us: number; id_post: number }) {
    return this.reaccionService.create(body.id_us, body.id_post);
  }

  @Delete()
  delete(
    @Query('id_us') id_us: number,
    @Query('id_post') id_post: number,
  ) {
    return this.reaccionService.delete(id_us, id_post);
  }
}
