import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { posts } from '../../db/schema.js';

@Injectable()
export class PostService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0] ?? null;
  }
}