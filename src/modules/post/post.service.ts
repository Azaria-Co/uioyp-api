import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../../db/client.js';
import { posts, multimedia, especialistas, usuarios } from '../../db/schema.js';

@Injectable()
export class PostService {
  async findAll() {
    // Traer posts con especialista y nombre_us del usuario
    const { eq } = await import('drizzle-orm');
    const result = await db
      .select({
        id: posts.id,
        titulo: posts.titulo,
        fecha: posts.fecha,
        texto: posts.texto,
        id_esp: posts.id_esp,
        especialista: {
          id: especialistas.id,
          area: especialistas.area,
          id_us: especialistas.id_us,
          nombre_us: usuarios.nombre_us,
        },
      })
      .from(posts)
      .leftJoin(especialistas, eq(posts.id_esp, especialistas.id))
      .leftJoin(usuarios, eq(especialistas.id_us, usuarios.id));
    return result;
  }
  async createPost(data: { titulo: string; texto: string; id_esp: number; multimedia: string[] }) {
    // Insertar el post con fecha actual
    const result: any = await db.insert(posts).values({
      titulo: data.titulo,
      texto: data.texto,
      fecha: new Date(),
      id_esp: data.id_esp,
    });
    const insertId = result.insertId || (result[0] && result[0].insertId);
    // Insertar multimedia asociada
    if (data.multimedia && data.multimedia.length > 0) {
      for (const tipo of data.multimedia) {
        await db.insert(multimedia).values({ tipo, id_post: insertId });
      }
    }
    // Devolver el post creado
    const { eq } = await import('drizzle-orm');
    const [post] = await db.select().from(posts).where(eq(posts.id, insertId));
    return post;
  }

  async deletePost(id: number, id_esp: number) {
    // Solo el especialista dueño puede borrar
    const { eq } = await import('drizzle-orm');
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.id_esp !== id_esp) throw new ForbiddenException('No puedes borrar este post');
    // Borrar multimedia asociada
    await db.delete(multimedia).where(eq(multimedia.id_post, id));
    // Borrar el post
    await db.delete(posts).where(eq(posts.id, id));
    return { deleted: true };
  }

  async findById(id: number) {
    const { eq } = await import('drizzle-orm');
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0] ?? null;
  }
}