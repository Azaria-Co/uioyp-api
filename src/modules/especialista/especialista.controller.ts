
//src/modules/especialista/especialista.controller.tsa
import { Controller, Get, Param } from '@nestjs/common';
import { EspecialistaService } from './especialista.service.js';

@Controller('especialistas')
export class EspecialistaController {
  constructor(private readonly especialistaService: EspecialistaService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.especialistaService.findById(id);
  }

  @Get('/por-usuario/:id_us')
  findByUsuario(@Param('id_us') id_us: number) {
    return this.especialistaService.findByUsuarioId(id_us);
  }
}
