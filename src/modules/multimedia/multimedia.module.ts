import { Module } from '@nestjs/common';
import { MultimediaService } from './multimedia.service.js';
import { MultimediaController } from './multimedia.controller.js';

@Module({
  controllers: [MultimediaController],
  providers: [MultimediaService],
})
export class MultimediaModule {}