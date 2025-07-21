import { Module } from '@nestjs/common';
import { EspecialistaService } from './especialista.service.js';
import { EspecialistaController } from './especialista.controller.js';

@Module({
  controllers: [EspecialistaController],
  providers: [EspecialistaService],
})
export class EspecialistaModule {}
