import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { reacciones } from '../../db/schema.js';

@Injectable()
export class ReaccionService {
  async findByIds(id_us: number, id_post: number) {
    const { and, eq } = await import('drizzle-orm');
    const result = await db
      .select()
      .from(reacciones)
      .where(and(eq(reacciones.id_us, id_us), eq(reacciones.id_post, id_post)));
    return result[0] ?? null;
  }
}