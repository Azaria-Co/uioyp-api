import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { pacientes, usuarios } from '../../db/schema.js';

@Injectable()
export class PacienteService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(pacientes).where(eq(pacientes.id, id));
    return result[0] ?? null;
  }

  async findByUsuario(id_us: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select()
      .from(pacientes)
      .where(eq(pacientes.id_us, id_us));
    
    return result[0] ?? null;
  }

  async findAll() {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: pacientes.id,
        masa_muscular: pacientes.masa_muscular,
        tipo_sangre: pacientes.tipo_sangre,
        enfer_pat: pacientes.enfer_pat,
        telefono: pacientes.telefono,
        id_us: pacientes.id_us,
        nombre_us: usuarios.nombre_us,
      })
      .from(pacientes)
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id));
    
    return result;
  }
}