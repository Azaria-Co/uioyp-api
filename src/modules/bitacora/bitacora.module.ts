import { Module } from '@nestjs/common';
import { BitacoraService } from './bitacora.service.js';
import { BitacoraController } from './bitacora.controller.js';

@Module({
  controllers: [BitacoraController],
  providers: [BitacoraService],
})
export class BitacoraModule {}