import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module.js';
import { EspecialistaModule } from './modules/especialista/especialista.module.js';
import { PacienteModule } from './modules/paciente/paciente.module.js';
import { PostModule } from './modules/post/post.module.js';
import { ReaccionModule } from './modules/reaccion/reaccion.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [UsuarioModule, EspecialistaModule, PacienteModule, PostModule, ReaccionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
