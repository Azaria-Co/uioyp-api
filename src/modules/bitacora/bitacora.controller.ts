import { Controller, Get, Post, Delete, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { BitacoraService } from './bitacora.service.js';

@Controller('bitacoras')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get()
  findAll(@Query('id_pac') id_pac?: number) {
    if (id_pac) {
      return this.bitacoraService.findByPaciente(id_pac);
    }
    return this.bitacoraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bitacoraService.findById(id);
  }

  @Post()
  async create(@Body() body: { fecha: string; presion_ar: string; glucosa: number; id_pac: number }) {
    try {
      console.log('Recibiendo datos para crear bitácora:', body);
      
      if (!body.fecha || !body.presion_ar || body.glucosa === undefined || !body.id_pac) {
        throw new HttpException('Faltan datos requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.bitacoraService.create(body.fecha, body.presion_ar, body.glucosa, body.id_pac);
      console.log('Bitácora creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en controller al crear bitácora:', error);
      
      // Manejar diferentes tipos de errores
      if (error instanceof HttpException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
      const errorStatus = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(errorMessage, errorStatus);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bitacoraService.delete(id);
  }
}