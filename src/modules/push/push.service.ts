import { Injectable } from '@nestjs/common';
import { db } from '../../db/client.js';
import { pushTokens, settings, patientReminders, pacientes } from '../../db/schema.js';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class PushService {
  private expo = new Expo();
  private lastGlobalSentStamp: string | null = null;

  constructor() {
    // Chequeo cada minuto
    setInterval(() => {
      this.sendDueReminders().catch(() => {});
    }, 60 * 1000);
  }

  async registerToken(id_us: number, token: string, platform: string) {
    await db.insert(pushTokens).values({ id_us, token, platform });
    return { saved: true };
  }

  async setGlobalReminder(hour: number, minute: number) {
    const key = 'daily_reminder_time';
    const value = `${hour}:${minute}`;
    const { eq } = await import('drizzle-orm');
    await db.delete(settings).where(eq(settings.key, key));
    await db.insert(settings).values({ key, value });
    return { saved: true, hour, minute };
  }

  async getGlobalReminder(): Promise<{ hour: number; minute: number } | null> {
    const key = 'daily_reminder_time';
    const { eq } = await import('drizzle-orm');
    const [row] = await db.select().from(settings).where(eq(settings.key, key));
    if (!row || !row.value) return null;
    const [h, m] = String(row.value).split(':').map((v) => Number(v));
    if (Number.isFinite(h) && Number.isFinite(m)) return { hour: h, minute: m };
    return null;
  }

  async createPatientReminder(data: { id_pac: number; hour: number; minute: number; created_by: number; active?: number }) {
    const row = {
      id_pac: data.id_pac,
      hour: data.hour,
      minute: data.minute,
      created_by: data.created_by,
      active: data.active ?? 1,
    } as any;
    await db.insert(patientReminders).values(row);
    return { saved: true };
  }

  async listPatientReminders(id_pac?: number) {
    const { eq } = await import('drizzle-orm');
    if (typeof id_pac === 'number') {
      return db.select().from(patientReminders).where(eq(patientReminders.id_pac, id_pac));
    }
    return db.select().from(patientReminders);
  }

  async setPatientReminderActive(id: number, active: number) {
    const { eq } = await import('drizzle-orm');
    await db.update(patientReminders).set({ active: active ? 1 as any : 0 as any }).where(eq(patientReminders.id, id));
    return { saved: true };
  }

  async deletePatientReminder(id: number) {
    const { eq } = await import('drizzle-orm');
    await db.delete(patientReminders).where(eq(patientReminders.id, id));
    return { deleted: true };
  }

  private getNowHourMinute(): { hour: number; minute: number; today: string } {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const today = now.toISOString().slice(0, 10);
    return { hour, minute, today };
  }

  private async sendDueReminders() {
    const { hour, minute, today } = this.getNowHourMinute();
    const { eq, and, or } = await import('drizzle-orm');

    // Buscar recordatorios activos que correspondan a la hora/minuto y que no se hayan enviado hoy
    const reminders = await db
      .select()
      .from(patientReminders)
      .where(
        and(
          eq(patientReminders.hour, hour),
          eq(patientReminders.minute, minute),
          eq(patientReminders.active, 1 as any),
        ),
      );

    if (!Array.isArray(reminders) || reminders.length === 0) return;

    // Obtener tokens por paciente
    const { inArray } = await import('drizzle-orm');
    const pacIds = reminders.map((r: any) => r.id_pac).filter(Boolean);
    if (pacIds.length === 0) return;

    const pacRows = await db
      .select({ id_pac: pacientes.id, id_us: pacientes.id_us })
      .from(pacientes)
      .where(inArray(pacientes.id, pacIds as any));

    const idusSet = new Set<number>();
    pacRows.forEach((p: any) => { if (p.id_us) idusSet.add(p.id_us as number); });
    if (idusSet.size === 0) return;

    const idusArr = Array.from(idusSet);
    const tokenRows = await db
      .select()
      .from(pushTokens)
      .where(inArray(pushTokens.id_us, idusArr as any));

    const tokens = tokenRows.map((t: any) => t.token).filter(Boolean);
    if (tokens.length === 0) return;

    const messages: ExpoPushMessage[] = [];
    const isValidExpoToken = (t: string) => typeof t === 'string' && (t.startsWith('ExponentPushToken[') || t.startsWith('ExpoPushToken['));
    for (const token of tokens) {
      if (!isValidExpoToken(token)) continue;
      messages.push({
        to: token,
        sound: 'default',
        title: 'Recordatorio de bitácora',
        body: 'Por favor registra tu bitácora de hoy. Gracias 🙌',
        data: { type: 'bitacora-reminder' },
      });
    }

    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch {
        // noop
      }
    }

    // Marcar enviados hoy
    for (const r of reminders) {
      try {
        const { eq: eq2 } = await import('drizzle-orm');
        await db
          .update(patientReminders)
          .set({ last_sent: new Date() as any })
          .where(eq2(patientReminders.id, r.id));
      } catch {}
    }

    // Envío GLOBAL por hora configurada
    const global = await this.getGlobalReminder();
    if (global && global.hour === hour && global.minute === minute) {
      const stamp = `${today}-${hour}-${minute}`;
      if (this.lastGlobalSentStamp === stamp) return; // evitar duplicado mismo minuto
      this.lastGlobalSentStamp = stamp;

      // Obtener todos los id_us de pacientes
      const pacRows = await db.select({ id_us: pacientes.id_us }).from(pacientes);
      const idusArr = Array.from(new Set(pacRows.map((p: any) => p.id_us).filter(Boolean)));
      if (idusArr.length === 0) return;

      const { inArray } = await import('drizzle-orm');
      const tokenRows = await db.select().from(pushTokens).where(inArray(pushTokens.id_us, idusArr as any));
      const tokens = tokenRows.map((t: any) => t.token).filter(Boolean);
      if (tokens.length === 0) return;

      const messages: ExpoPushMessage[] = [];
      const isValidExpoToken = (t: string) => typeof t === 'string' && (t.startsWith('ExponentPushToken[') || t.startsWith('ExpoPushToken['));
      for (const token of tokens) {
        if (!isValidExpoToken(token)) continue;
        messages.push({
          to: token,
          sound: 'default',
          title: 'Recordatorio de bitácora',
          body: 'Recuerda registrar tu bitácora de hoy ✍️',
          data: { type: 'bitacora-reminder-global' },
        });
      }
      const chunks = this.expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try { await this.expo.sendPushNotificationsAsync(chunk); } catch {}
      }
    }
  }
}
