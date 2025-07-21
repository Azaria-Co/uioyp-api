import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { bitacoras } from '../../db/schema.js';

@Injectable()
export class BitacoraService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(bitacoras).where(eq(bitacoras.id, id));
    return result[0] ?? null;
  }
}