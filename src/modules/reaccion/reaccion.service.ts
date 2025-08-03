// src/modules/reaccion/reaccion.service.ts
import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { reacciones } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ReaccionService {
  async findByIds(id_us: number, id_post: number) {
    const result = await db
      .select()
      .from(reacciones)
      .where(and(eq(reacciones.id_us, id_us), eq(reacciones.id_post, id_post)));
    return result[0] ?? null;
  }

  async create(id_us: number, id_post: number) {
    const result = await db.insert(reacciones).values({
      id_us,
      id_post,
      fecha: new Date(),
    });
    return result;
  }

  async delete(id_us: number, id_post: number) {
    const result = await db
      .delete(reacciones)
      .where(and(eq(reacciones.id_us, id_us), eq(reacciones.id_post, id_post)));
    return result;
  }

  async countByPost(id_post: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select()
      .from(reacciones)
      .where(eq(reacciones.id_post, id_post));
    
    return result.length;
  }
}
