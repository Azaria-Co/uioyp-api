import { Module } from '@nestjs/common';
import { PushService } from './push.service.js';
import { PushController } from './push.controller.js';

@Module({
  controllers: [PushController],
  providers: [PushService],
})
export class PushModule {}
