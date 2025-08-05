// src/modules/progreso/progreso.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db/client.js';
import { progresos, pacientes, usuarios } from '../../db/schema.js';

@Injectable()
export class ProgresoService {
  async findAll() {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: progresos.id,
        fecha: progresos.fecha,
        etapa: progresos.etapa,
        id_pac: progresos.id_pac,
        paciente: {
          id: pacientes.id,
          masa_muscular: pacientes.masa_muscular,
          tipo_sangre: pacientes.tipo_sangre,
          enfer_pat: pacientes.enfer_pat,
          telefono: pacientes.telefono,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(progresos)
      .leftJoin(pacientes, eq(progresos.id_pac, pacientes.id))
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id));
    
    return result;
  }

  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: progresos.id,
        fecha: progresos.fecha,
        etapa: progresos.etapa,
        id_pac: progresos.id_pac,
        paciente: {
          id: pacientes.id,
          masa_muscular: pacientes.masa_muscular,
          tipo_sangre: pacientes.tipo_sangre,
          enfer_pat: pacientes.enfer_pat,
          telefono: pacientes.telefono,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(progresos)
      .leftJoin(pacientes, eq(progresos.id_pac, pacientes.id))
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id))
      .where(eq(progresos.id, id));
    
    return result[0] ?? null;
  }

  async findByPaciente(id_pac: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: progresos.id,
        fecha: progresos.fecha,
        etapa: progresos.etapa,
        id_pac: progresos.id_pac,
        paciente: {
          id: pacientes.id,
          masa_muscular: pacientes.masa_muscular,
          tipo_sangre: pacientes.tipo_sangre,
          enfer_pat: pacientes.enfer_pat,
          telefono: pacientes.telefono,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(progresos)
      .leftJoin(pacientes, eq(progresos.id_pac, pacientes.id))
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id))
      .where(eq(progresos.id_pac, id_pac));
    
    return result;
  }

  async create(fecha: string, etapa: string, id_pac: number) {
    await db.insert(progresos).values({
      fecha: new Date(fecha),
      etapa,
      id_pac,
    });
    
    // Obtener el progreso recién creado usando los valores insertados
    const { eq, and, desc } = await import('drizzle-orm');
    const [progreso] = await db
      .select()
      .from(progresos)
      .where(
        and(
          eq(progresos.fecha, new Date(fecha)),
          eq(progresos.etapa, etapa),
          eq(progresos.id_pac, id_pac)
        )
      )
      .orderBy(desc(progresos.id))
      .limit(1);
    
    return progreso;
  }

  async delete(id: number) {
    const { eq } = await import('drizzle-orm');
    const [progreso] = await db.select().from(progresos).where(eq(progresos.id, id));
    
    if (!progreso) {
      throw new NotFoundException('Progreso no encontrado');
    }
    
    await db.delete(progresos).where(eq(progresos.id, id));
    return { deleted: true, id };
  }
}