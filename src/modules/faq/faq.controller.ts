import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { FaqService } from './faq.service.js';

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // Listar todas las FAQs o por área (?area=...)
  @Get()
  async find(@Query('area') area?: string) {
    if (area) return this.faqService.findByArea(area);
    return this.faqService.findAll();
  }

  // Crear FAQ (id_esp proviene del especialista)
  @Post()
  async create(@Body() body: { pregunta: string; respuesta: string; id_esp: number }) {
    return this.faqService.create(body);
  }

  // Eliminar FAQ (solo dueño)
  @Delete(':id')
  async remove(@Param('id') id: number, @Body('id_esp') id_esp: number) {
    return this.faqService.remove(Number(id), id_esp);
  }
}


