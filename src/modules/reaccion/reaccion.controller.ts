import { Controller, Get, Query } from '@nestjs/common';
import { ReaccionService } from './reaccion.service.js';

@Controller('reacciones')
export class ReaccionController {
  constructor(private readonly reaccionService: ReaccionService) {}

  @Get()
  findOne(@Query('id_us') id_us: number, @Query('id_post') id_post: number) {
    return this.reaccionService.findByIds(id_us, id_post);
  }
}