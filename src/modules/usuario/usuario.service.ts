//src/modules/usuario/usuario.service.ts
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
}
