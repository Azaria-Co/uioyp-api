import { Module } from '@nestjs/common';
import { ReaccionService } from './reaccion.service.js';
import { ReaccionController } from './reaccion.controller.js';

@Module({
  controllers: [ReaccionController],
  providers: [ReaccionService],
})
export class ReaccionModule {}