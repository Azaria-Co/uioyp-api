import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { multimedia } from '../../db/schema.js';

interface FileInfo {
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  id_post: number | null;
}

@Injectable()
export class MultimediaService {
  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(multimedia).where(eq(multimedia.id, id));
    return result[0] ?? null;
  }

  async saveFileInfo(fileInfo: FileInfo) {
    const result: any = await db.insert(multimedia).values({
      filename: fileInfo.filename,
      original_name: fileInfo.original_name,
      file_path: fileInfo.file_path,
      file_size: fileInfo.file_size,
      mime_type: fileInfo.mime_type,
      id_post: fileInfo.id_post,
    });

    const insertId = result.insertId || (result[0] && result[0].insertId);
    
    // Devolver el registro completo
    const { eq } = await import('drizzle-orm');
    const [savedFile] = await db.select().from(multimedia).where(eq(multimedia.id, insertId));
    return savedFile;
  }

  async findByPostId(postId: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(multimedia).where(eq(multimedia.id_post, postId));
    return result;
  }

  async deleteById(id: number) {
    const { eq } = await import('drizzle-orm');
    await db.delete(multimedia).where(eq(multimedia.id, id));
    return { deleted: true };
  }

  async findAll() {
    const result = await db.select().from(multimedia);
    return result;
  }
}