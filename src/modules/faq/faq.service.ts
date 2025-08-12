import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../../db/client.js';
import { faqs, especialistas } from '../../db/schema.js';

@Injectable()
export class FaqService {
  async findAll() {
    return db.select().from(faqs);
  }

  async findByArea(area: string) {
    const { eq } = await import('drizzle-orm');
    // Selecciona FAQs donde el especialista perteneciente tiene el área solicitada
    const result = await db
      .select({
        id: faqs.id,
        pregunta: faqs.pregunta,
        respuesta: faqs.respuesta,
        id_esp: faqs.id_esp,
      })
      .from(faqs)
      .leftJoin(especialistas, eq(faqs.id_esp, especialistas.id))
      .where(eq(especialistas.area, area));
    return result;
  }

  async create(data: { pregunta: string; respuesta: string; id_esp: number }) {
    const result: any = await db.insert(faqs).values({
      pregunta: data.pregunta,
      respuesta: data.respuesta,
      id_esp: data.id_esp,
    });
    const insertId = result.insertId || (result[0] && result[0].insertId);
    const { eq } = await import('drizzle-orm');
    const [row] = await db.select().from(faqs).where(eq(faqs.id, insertId));
    return row;
  }

  async remove(id: number, id_esp: number) {
    const { eq } = await import('drizzle-orm');
    const rows = await db.select().from(faqs).where(eq(faqs.id, id));
    const row = rows[0];
    if (!row) throw new NotFoundException('FAQ no encontrada');
    if (row.id_esp !== id_esp) throw new ForbiddenException('No puedes borrar esta FAQ');
    await db.delete(faqs).where(eq(faqs.id, id));
    return { deleted: true };
  }
}



