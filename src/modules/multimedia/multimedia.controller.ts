import { Controller, Get, Param } from '@nestjs/common';
import { MultimediaService } from './multimedia.service.js';

@Controller('multimedia')
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.multimediaService.findById(id);
  }
}