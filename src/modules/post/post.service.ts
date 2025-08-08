// src/modules/post/post.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../../db/client.js';
import { posts, multimedia, especialistas, usuarios, reacciones, pacientes } from '../../db/schema.js';
import { sql } from 'drizzle-orm';


@Injectable()
export class PostService {
  async findAll() {
    const { eq } = await import('drizzle-orm');

    const result = await db
      .select({
        id: posts.id,
        titulo: posts.titulo,
        fecha: posts.fecha,
        texto: posts.texto,
        tipo: posts.tipo, // Agregar campo tipo
        id_esp: posts.id_esp,
        especialista: {
          id: especialistas.id,
          area: especialistas.area,
          id_us: especialistas.id_us,
          nombre_us: usuarios.nombre_us,
        },
        likes: sql<number>`(
          SELECT COUNT(*) FROM reaccion WHERE reaccion.id_post = ${posts.id}
        )`.as('likes'),
      })
      .from(posts)
      .leftJoin(especialistas, eq(posts.id_esp, especialistas.id))
      .leftJoin(usuarios, eq(especialistas.id_us, usuarios.id));
    
    return result;
  }
  async createPost(data: { titulo: string; texto: string; tipo?: string; id_esp: number; multimedia: string[] }) {
    // Insertar el post con fecha actual
    const result: any = await db.insert(posts).values({
      titulo: data.titulo,
      texto: data.texto,
      tipo: data.tipo || 'normal', // Default a 'normal'
      fecha: new Date(),
      id_esp: data.id_esp,
    });
    const insertId = result.insertId || (result[0] && result[0].insertId);
    // Insertar multimedia asociada (temporalmente comentado hasta migrar la BD)
    if (data.multimedia && data.multimedia.length > 0) {
      console.log('Multimedia pendiente de implementar tras migración de BD:', data.multimedia);
      // TODO: Implementar después de migrar tabla multimedia
      /*
      for (const tipo of data.multimedia) {
        await db.insert(multimedia).values({ 
          filename: tipo, // Temporal
          original_name: tipo,
          file_path: `/uploads/${tipo}`,
          file_size: 0,
          mime_type: 'image/jpeg',
          id_post: insertId 
        });
      }
      */
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

  // Obtener investigaciones de un especialista específico
  async getInvestigacionesByEspecialista(id_esp: number) {
    const { eq, and } = await import('drizzle-orm');

    const result = await db
      .select({
        id: posts.id,
        titulo: posts.titulo,
        fecha: posts.fecha,
        texto: posts.texto,
        tipo: posts.tipo,
        id_esp: posts.id_esp,
        participantes: sql<number>`(
          SELECT COUNT(*) FROM reaccion WHERE reaccion.id_post = ${posts.id}
        )`.as('participantes'),
      })
      .from(posts)
      .where(
        and(
          eq(posts.id_esp, id_esp),
          eq(posts.tipo, 'investigacion')
        )
      )
      .orderBy(posts.fecha);

    return result;
  }

  // Obtener participantes (usuarios que dieron "me interesa") de una investigación
  async getParticipantesInvestigacion(id_post: number) {
    const { eq } = await import('drizzle-orm');

    // Primero verificar que el post existe y es de tipo investigación
    const [post] = await db.select().from(posts).where(eq(posts.id, id_post));
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.tipo !== 'investigacion') {
      throw new ForbiddenException('Solo se pueden ver participantes de investigaciones');
    }

    // Obtener usuarios que reaccionaron al post
    const result = await db
      .select({
        id: reacciones.id_us,
        nombre: usuarios.nombre_us,
        telefono: sql<string>`
          CASE 
            WHEN ${pacientes.telefono} IS NOT NULL THEN ${pacientes.telefono}
            ELSE 'No disponible'
          END
        `.as('telefono'),
        fecha_inscripcion: reacciones.fecha,
      })
      .from(reacciones)
      .leftJoin(usuarios, eq(reacciones.id_us, usuarios.id))
      .leftJoin(pacientes, eq(pacientes.id_us, usuarios.id))
      .where(eq(reacciones.id_post, id_post))
      .orderBy(reacciones.fecha);

    return result;
  }
}