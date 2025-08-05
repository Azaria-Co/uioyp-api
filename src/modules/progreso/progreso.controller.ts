// src/modules/progreso/progreso.controller.ts
import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ProgresoService } from './progreso.service.js';

@Controller('progresos')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Get()
  findAll(@Query('id_pac') id_pac?: number) {
    if (id_pac) {
      return this.progresoService.findByPaciente(id_pac);
    }
    return this.progresoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.progresoService.findById(id);
  }

  @Post()
  create(@Body() body: { fecha: string; etapa: string; id_pac: number }) {
    return this.progresoService.create(body.fecha, body.etapa, body.id_pac);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.progresoService.delete(id);
  }
}