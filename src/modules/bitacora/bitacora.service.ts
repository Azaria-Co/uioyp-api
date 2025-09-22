// src/modules/bitacora/bitacora.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db/client.js';
import { bitacoras, pacientes, usuarios } from '../../db/schema.js';

@Injectable()
export class BitacoraService {
  async findAll() {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: bitacoras.id,
        fecha: bitacoras.fecha,
        presion_ar: bitacoras.presion_ar,
        glucosa: bitacoras.glucosa,
        comidas: bitacoras.comidas, // Nuevo campo
        medicamentos: bitacoras.medicamentos, // Nuevo campo
        id_pac: bitacoras.id_pac,
        paciente: {
          id: pacientes.id,
          masa_muscular: pacientes.masa_muscular,
          tipo_sangre: pacientes.tipo_sangre,
          enfer_pat: pacientes.enfer_pat,
          telefono: pacientes.telefono,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(bitacoras)
      .leftJoin(pacientes, eq(bitacoras.id_pac, pacientes.id))
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id));
    
    return result;
  }

  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: bitacoras.id,
        fecha: bitacoras.fecha,
        presion_ar: bitacoras.presion_ar,
        glucosa: bitacoras.glucosa,
        comidas: bitacoras.comidas, // Nuevo campo
        medicamentos: bitacoras.medicamentos, // Nuevo campo
        id_pac: bitacoras.id_pac,
        paciente: {
          id: pacientes.id,
          masa_muscular: pacientes.masa_muscular,
          tipo_sangre: pacientes.tipo_sangre,
          enfer_pat: pacientes.enfer_pat,
          telefono: pacientes.telefono,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(bitacoras)
      .leftJoin(pacientes, eq(bitacoras.id_pac, pacientes.id))
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id))
      .where(eq(bitacoras.id, id));
    
    return result[0] ?? null;
  }

  async findByPaciente(id_pac: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: bitacoras.id,
        fecha: bitacoras.fecha,
        presion_ar: bitacoras.presion_ar,
        glucosa: bitacoras.glucosa,
        comidas: bitacoras.comidas, // Nuevo campo
        medicamentos: bitacoras.medicamentos, // Nuevo campo
        id_pac: bitacoras.id_pac,
        paciente: {
          id: pacientes.id,
          masa_muscular: pacientes.masa_muscular,
          tipo_sangre: pacientes.tipo_sangre,
          enfer_pat: pacientes.enfer_pat,
          telefono: pacientes.telefono,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(bitacoras)
      .leftJoin(pacientes, eq(bitacoras.id_pac, pacientes.id))
      .leftJoin(usuarios, eq(pacientes.id_us, usuarios.id))
      .where(eq(bitacoras.id_pac, id_pac));
    
    return result;
  }

  async create(fecha: string, presion_ar: string, glucosa: number, id_pac: number, comidas?: string, medicamentos?: string) {
    try {
      const fechaStr = new Date(fecha).toISOString();
      await db.insert(bitacoras).values({
        fecha: fechaStr,
        presion_ar,
        glucosa: glucosa.toString(),
        comidas,
        medicamentos,
        id_pac,
      });
      // Obtener la bitácora recién creada usando los valores insertados
      const { eq, and, desc } = await import('drizzle-orm');
      const whereClauses = [
        eq(bitacoras.fecha, fechaStr),
        eq(bitacoras.presion_ar, presion_ar),
        eq(bitacoras.glucosa, glucosa.toString()),
        eq(bitacoras.id_pac, id_pac)
      ];
      if (typeof comidas === 'string') {
        whereClauses.push(eq(bitacoras.comidas, comidas));
      }
      if (typeof medicamentos === 'string') {
        whereClauses.push(eq(bitacoras.medicamentos, medicamentos));
      }
      const [bitacora] = await db
        .select()
        .from(bitacoras)
        .where(and(...whereClauses))
        .orderBy(desc(bitacoras.id))
        .limit(1);
      return bitacora;
    } catch (error) {
      console.error('Error en service al crear bitácora:', error);
      throw error;
    }
  }

  async delete(id: number) {
    const { eq } = await import('drizzle-orm');
    const [bitacora] = await db.select().from(bitacoras).where(eq(bitacoras.id, id));
    
    if (!bitacora) {
      throw new NotFoundException('Bitácora no encontrada');
    }
    
    await db.delete(bitacoras).where(eq(bitacoras.id, id));
    return { deleted: true, id };
  }
}