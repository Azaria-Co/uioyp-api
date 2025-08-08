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

interface MultimediaInfo {
  tipo: 'image' | 'video' | 'link';
  id_post: number;
  // Para imágenes
  filename?: string;
  original_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  // Para videos y enlaces
  url?: string;
  titulo?: string;
  descripcion?: string;
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
      tipo: 'image', // Por compatibilidad hacia atrás
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

  async saveMultimediaInfo(multimediaInfo: MultimediaInfo) {
    const values: any = {
      tipo: multimediaInfo.tipo,
      id_post: multimediaInfo.id_post,
    };

    // Agregar campos según el tipo
    if (multimediaInfo.tipo === 'image') {
      values.filename = multimediaInfo.filename;
      values.original_name = multimediaInfo.original_name;
      values.file_path = multimediaInfo.file_path;
      values.file_size = multimediaInfo.file_size;
      values.mime_type = multimediaInfo.mime_type || 'image/jpeg';
    } else if (multimediaInfo.tipo === 'video') {
      values.url = multimediaInfo.url;
      values.titulo = multimediaInfo.titulo;
      values.descripcion = multimediaInfo.descripcion;
      values.mime_type = 'video/youtube';
    } else if (multimediaInfo.tipo === 'link') {
      values.url = multimediaInfo.url;
      values.titulo = multimediaInfo.titulo;
      values.descripcion = multimediaInfo.descripcion;
      values.mime_type = 'text/url';
    }

    const result: any = await db.insert(multimedia).values(values);
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