import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { multimedia } from '../../db/schema.js';

@Injectable()
export class MultimediaService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(multimedia).where(eq(multimedia.id, id));
    return result[0] ?? null;
  }
}