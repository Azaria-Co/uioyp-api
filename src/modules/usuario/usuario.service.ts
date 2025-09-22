// src/modules/usuario/usuario.service.ts
import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { usuarios } from '../../db/schema.js';

@Injectable()
export class UsuarioService {
  async findAll() {
    const results = await db.select().from(usuarios);
    return results;
  }

  async findByNombreUs(nombre_us: string) {
    // Import the eq function from your query builder (Drizzle ORM)
    const { eq } = await import('drizzle-orm');
    const results = await db.select().from(usuarios).where(eq(usuarios.nombre_us, nombre_us));
    return results[0] ?? null;
  }

  async generateJwt(user: any) {
    const jwt = await import('@nestjs/jwt');
    const JwtService = jwt.JwtService;
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET ?? 'defaultsecret' });
    return jwtService.sign({ id: user.id, rol: user.rol, nombre_us: user.nombre_us });
  }

  async createUsuario(body: any) {
    // body: { nombre_us, rol, especialista?, paciente? }
    const { nombre_us, rol, especialista, paciente } = body;
    // Insertar usuario
    await db.insert(usuarios).values({ nombre_us, rol });
    // Consultar usuario creado por nombre_us y rol
    const { eq, and } = await import('drizzle-orm');
    const [usuario] = await db
      .select()
      .from(usuarios)
      .where(and(eq(usuarios.nombre_us, nombre_us), eq(usuarios.rol, rol)));
    // Si es especialista
    if (rol === 2 && especialista && usuario) {
      const { estatus, area } = especialista;
      await db.insert((await import('../../db/schema.js')).especialistas).values({ estatus, area, id_us: usuario.id });
    }
    // Si es paciente
    if (rol === 3 && paciente && usuario) {
      const { masa_muscular, tipo_sangre, enfer_pat, telefono } = paciente;
      await db.insert((await import('../../db/schema.js')).pacientes).values({ masa_muscular, tipo_sangre, enfer_pat, telefono, id_us: usuario.id });
    }
    return usuario;
  }
}
