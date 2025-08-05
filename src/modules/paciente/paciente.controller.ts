import { Controller, Get, Param } from '@nestjs/common';
import { PacienteService } from './paciente.service.js';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pacienteService.findById(id);
  }

  @Get('by-usuario/:id_us')
  findByUsuario(@Param('id_us') id_us: number) {
    return this.pacienteService.findByUsuario(id_us);
  }

  @Get('by-especialista/:id_esp')
  findByEspecialista(@Param('id_esp') id_esp: number) {
    // Simplemente retorna todos los pacientes ya que cualquier especialista puede gestionarlos
    return this.pacienteService.findAll();
  }
}