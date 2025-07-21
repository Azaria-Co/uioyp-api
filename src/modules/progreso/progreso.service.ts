import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { progresos } from '../../db/schema.js';

@Injectable()
export class ProgresoService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(progresos).where(eq(progresos.id, id));
    return result[0] ?? null;
  }
}