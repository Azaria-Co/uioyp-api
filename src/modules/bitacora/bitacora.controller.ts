import { Controller, Get, Param } from '@nestjs/common';
import { BitacoraService } from './bitacora.service.js';

@Controller('bitacoras')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bitacoraService.findById(id);
  }
}