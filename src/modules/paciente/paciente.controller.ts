import { Controller, Get, Param } from '@nestjs/common';
import { PacienteService } from './paciente.service.js';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pacienteService.findById(id);
  }
}
