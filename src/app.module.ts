import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
