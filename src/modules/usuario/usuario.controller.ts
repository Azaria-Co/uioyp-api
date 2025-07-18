// src/modules/usuario/usuario.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Post('/auth/login')
  async login(@Body('nombre_us') nombre_us: string) {
    const user = await this.usuarioService.findByNombreUs(nombre_us);
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    const jwt = await this.usuarioService.generateJwt(user);
    return { token: jwt };
  }
}
