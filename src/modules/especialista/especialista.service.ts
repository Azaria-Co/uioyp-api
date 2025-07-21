import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { especialistas } from '../../db/schema.js';

@Injectable()
export class EspecialistaService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(especialistas).where(eq(especialistas.id, id));
    return result[0] ?? null;
  }
}
