import { Controller, Get, Param } from '@nestjs/common';
import { ProgresoService } from './progreso.service.js';

@Controller('progresos')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.progresoService.findById(id);
  }
}