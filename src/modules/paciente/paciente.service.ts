import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { pacientes } from '../../db/schema.js';

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
}
