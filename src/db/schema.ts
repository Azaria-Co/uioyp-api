// src/db/schema.ts
import {
  sqliteTable,
  integer,
  text,
  blob, // Ahora importado correctamente
} from "drizzle-orm/sqlite-core";

// ─────────── Usuarios ───────────
export const usuarios = sqliteTable("usuario", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre_us: text("nombre_us"),
  rol: integer("rol").notNull(),
});

// ─────────── Pacientes ───────────
export const pacientes = sqliteTable("paciente", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  masa_muscular: text("masa_muscular"),
  tipo_sangre: text("tipo_sangre"),
  enfer_pat: text("enfer_pat"),
  telefono: text("telefono"),
  id_us: integer("id_us").references(() => usuarios.id),
});

// ─────────── Especialistas ───────────
export const especialistas = sqliteTable("especialista", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  estatus: integer("estatus"),
  area: text("area"),
  id_us: integer("id_us").references(() => usuarios.id),
});

// ─────────── Post ───────────
export const posts = sqliteTable("post", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo"),
  fecha: text("fecha"),
  texto: text("texto"),
  tipo: text("tipo").default('normal'),
  id_esp: integer("id_esp").references(() => especialistas.id),
});

// ─────────── Multimedia ───────────
export const multimedia = sqliteTable("multimedia", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tipo: text("tipo").default('image'),
  url: text("url"),
  titulo: text("titulo"),
  descripcion: text("descripcion"),
  contenido_blob: blob("contenido_blob"), // La nueva columna BLOB para las imágenes
  id_post: integer("id_post").references(() => posts.id),
});

// ─────────── Reacción ───────────
export const reacciones = sqliteTable("reaccion", {
  id_us: integer("id_us").references(() => usuarios.id),
  id_post: integer("id_post").references(() => posts.id),
  fecha: text("fecha"),
});

// ─────────── Progreso ───────────
export const progresos = sqliteTable("progreso", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fecha: text("fecha"),
  etapa: text("etapa"),
  id_pac: integer("id_pac").references(() => pacientes.id),
});

// ─────────── Bitacora ───────────
export const bitacoras = sqliteTable("bitacora", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fecha: text("fecha"),
  presion_ar: text("presion_ar"),
  glucosa: text("glucosa"),
  id_pac: integer("id_pac").references(() => pacientes.id),
  comidas: text("comidas"),
  medicamentos: text("medicamentos"),
});

// ─────────── Preguntas Frecuentes (FAQ) ───────────
export const faqs = sqliteTable("faq", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pregunta: text("pregunta"),
  respuesta: text("respuesta"),
  id_esp: integer("id_esp").references(() => especialistas.id),
});

// ─────────── Push tokens ───────────
export const pushTokens = sqliteTable("push_token", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token"),
  platform: text("platform"),
  id_us: integer("id_us").references(() => usuarios.id),
});

// ─────────── Settings (clave-valor) ───────────
export const settings = sqliteTable("setting", {
  key: text("key").primaryKey(),
  value: text("value"),
});

// ─────────── Patient reminders (push) ───────────
export const patientReminders = sqliteTable("patient_reminder", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  id_pac: integer("id_pac").references(() => pacientes.id),
  hour: integer("hour"),
  minute: integer("minute"),
  last_sent: text("last_sent"),
  created_by: integer("created_by").references(() => especialistas.id),
  active: integer("active"),
});