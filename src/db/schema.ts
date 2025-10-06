// src/db/schema.ts
import {
  mysqlTable,
  int,
  varchar,
  text,
  primaryKey,
} from "drizzle-orm/mysql-core";

// ─────────── Usuarios ───────────
export const usuarios = mysqlTable("usuario", {
  id: int("id").primaryKey().autoincrement(),
  nombre_us: varchar("nombre_us", { length: 255 }),
  rol: int("rol").notNull(),
});

// ─────────── Pacientes ───────────
export const pacientes = mysqlTable("paciente", {
  id: int("id").primaryKey().autoincrement(),
  masa_muscular: text("masa_muscular"),
  tipo_sangre: varchar("tipo_sangre", { length: 10 }),
  enfer_pat: text("enfer_pat"),
  telefono: varchar("telefono", { length: 20 }),
  id_us: int("id_us").references(() => usuarios.id),
});

// ─────────── Especialistas ───────────
export const especialistas = mysqlTable("especialista", {
  id: int("id").primaryKey().autoincrement(),
  estatus: int("estatus"),
  area: varchar("area", { length: 100 }),
  id_us: int("id_us").references(() => usuarios.id),
});

// ─────────── Post ───────────
export const posts = mysqlTable("post", {
  id: int("id").primaryKey().autoincrement(),
  titulo: varchar("titulo", { length: 255 }),
  fecha: varchar("fecha", { length: 50 }),
  texto: text("texto"),
  tipo: varchar("tipo", { length: 50 }).default('normal'),
  id_esp: int("id_esp").references(() => especialistas.id),
});

// ─────────── Multimedia ───────────
export const multimedia = mysqlTable("multimedia", {
  id: int("id").primaryKey().autoincrement(),
  tipo: varchar("tipo", { length: 50 }).default('image'),
  url: text("url"),
  titulo: varchar("titulo", { length: 255 }),
  descripcion: text("descripcion"),
  contenido_blob: text("contenido_blob"), // La nueva columna BLOB para las imágenes
  id_post: int("id_post").references(() => posts.id),
});

// ─────────── Reacción ───────────
export const reacciones = mysqlTable("reaccion", {
  id_us: int("id_us").references(() => usuarios.id),
  id_post: int("id_post").references(() => posts.id),
  fecha: varchar("fecha", { length: 50 }),
}, (table) => ({
  pk: primaryKey({ columns: [table.id_us, table.id_post] }),
}));

// ─────────── Progreso ───────────
export const progresos = mysqlTable("progreso", {
  id: int("id").primaryKey().autoincrement(),
  fecha: varchar("fecha", { length: 50 }),
  etapa: varchar("etapa", { length: 100 }),
  id_pac: int("id_pac").references(() => pacientes.id),
});

// ─────────── Bitacora ───────────
export const bitacoras = mysqlTable("bitacora", {
  id: int("id").primaryKey().autoincrement(),
  fecha: varchar("fecha", { length: 50 }),
  presion_ar: varchar("presion_ar", { length: 20 }),
  glucosa: varchar("glucosa", { length: 20 }),
  id_pac: int("id_pac").references(() => pacientes.id),
  comidas: text("comidas"),
  medicamentos: text("medicamentos"),
});

// ─────────── Preguntas Frecuentes (FAQ) ───────────
export const faqs = mysqlTable("faq", {
  id: int("id").primaryKey().autoincrement(),
  pregunta: text("pregunta"),
  respuesta: text("respuesta"),
  id_esp: int("id_esp").references(() => especialistas.id),
});

// ─────────── Push tokens ───────────
export const pushTokens = mysqlTable("push_token", {
  id: int("id").primaryKey().autoincrement(),
  token: text("token"),
  platform: varchar("platform", { length: 50 }),
  id_us: int("id_us").references(() => usuarios.id),
});

// ─────────── Settings (clave-valor) ───────────
export const settings = mysqlTable("setting", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value"),
});

// ─────────── Patient reminders (push) ───────────
export const patientReminders = mysqlTable("patient_reminder", {
  id: int("id").primaryKey().autoincrement(),
  id_pac: int("id_pac").references(() => pacientes.id),
  hour: int("hour"),
  minute: int("minute"),
  last_sent: varchar("last_sent", { length: 50 }),
  created_by: int("created_by").references(() => especialistas.id),
  active: int("active"),
});