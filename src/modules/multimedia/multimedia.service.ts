import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { multimedia } from '../../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

interface FileInfo {
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  id_post: number | null;
  contenido_blob?: string | null;
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
  url?: string;
  titulo?: string;
  descripcion?: string;
}

@Injectable()
export class MultimediaService {
  async findByDescripcion(descripcion: string) {
    const result = await db.select().from(multimedia).where(eq(multimedia.descripcion, descripcion));
    return result[0] ?? null;
  }
  
  async findById(id: number) {
    const result = await db.select().from(multimedia).where(eq(multimedia.id, id));
    return result[0] ?? null;
  }

  async saveFileInfo(fileInfo: FileInfo) {
    await db.insert(multimedia).values({
      tipo: 'image',
      url: fileInfo.file_path, 
      titulo: fileInfo.original_name,
      descripcion: fileInfo.filename, 
      contenido_blob: fileInfo.contenido_blob ?? null,
      id_post: fileInfo.id_post,
    });
    
    const whereClauses = [
      eq(multimedia.tipo, 'image'),
      eq(multimedia.url, fileInfo.file_path),
      eq(multimedia.titulo, fileInfo.original_name),
      eq(multimedia.descripcion, fileInfo.filename)
    ];
    if (typeof fileInfo.id_post === 'number') {
      whereClauses.push(eq(multimedia.id_post, fileInfo.id_post));
    }
    const [savedFile] = await db
      .select()
      .from(multimedia)
      .where(and(...whereClauses))
      .orderBy(desc(multimedia.id))
      .limit(1);
    return savedFile;
  }

  async saveMultimediaInfo(multimediaInfo: MultimediaInfo) {
    const values: any = {
      tipo: multimediaInfo.tipo,
      id_post: multimediaInfo.id_post,
    };

    if (multimediaInfo.tipo === 'image') {
      values.url = multimediaInfo.file_path;
      values.titulo = multimediaInfo.original_name;
      values.descripcion = multimediaInfo.filename;
    } else if (multimediaInfo.tipo === 'video' || multimediaInfo.tipo === 'link') {
      values.url = multimediaInfo.url;
      values.titulo = multimediaInfo.titulo;
      values.descripcion = multimediaInfo.descripcion;
    }

    await db.insert(multimedia).values(values);
    const whereClauses = [
      eq(multimedia.tipo, multimediaInfo.tipo),
      eq(multimedia.id_post, multimediaInfo.id_post)
    ];
    if (multimediaInfo.tipo === 'image') {
      whereClauses.push(eq(multimedia.url, multimediaInfo.file_path ?? ''));
      whereClauses.push(eq(multimedia.titulo, multimediaInfo.original_name ?? ''));
      whereClauses.push(eq(multimedia.descripcion, multimediaInfo.filename ?? ''));
    } else if (multimediaInfo.tipo === 'video' || multimediaInfo.tipo === 'link') {
      whereClauses.push(eq(multimedia.url, multimediaInfo.url ?? ''));
      whereClauses.push(eq(multimedia.titulo, multimediaInfo.titulo ?? ''));
      whereClauses.push(eq(multimedia.descripcion, multimediaInfo.descripcion ?? ''));
    }
    const [savedFile] = await db
      .select()
      .from(multimedia)
      .where(and(...whereClauses))
      .orderBy(desc(multimedia.id))
      .limit(1);
    return savedFile;
  }

  async findByPostId(postId: number) {
    const result = await db.select().from(multimedia).where(eq(multimedia.id_post, postId));
    return result;
  }

  async deleteById(id: number) {
    await db.delete(multimedia).where(eq(multimedia.id, id));
    return { deleted: true };
  }

  async findAll() {
    const result = await db.select().from(multimedia);
    return result;
  }
}
