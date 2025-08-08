// src/db/schema.ts
import {
  mysqlTable,
  int,
  varchar,
  text,
  date,
  decimal,
  // blob, // Removed because not exported
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
  masa_muscular: decimal("masa_muscular", { precision: 10, scale: 2 }),
  tipo_sangre: varchar("tipo_sangre", { length: 3 }), // enum simulado
  enfer_pat: varchar("enfer_pat", { length: 255 }),
  telefono: varchar("telefono", { length: 15 }),
  id_us: int("id_us").references(() => usuarios.id),
});

// ─────────── Especialistas ───────────
export const especialistas = mysqlTable("especialista", {
  id: int("id").primaryKey().autoincrement(),
  estatus: int("estatus"),
  area: varchar("area", { length: 255 }),
  id_us: int("id_us").references(() => usuarios.id),
});

// ─────────── Post ───────────
export const posts = mysqlTable("post", {
  id: int("id").primaryKey().autoincrement(),
  titulo: varchar("titulo", { length: 100 }),
  fecha: date("fecha"),
  texto: text("texto"),
  tipo: varchar("tipo", { length: 20 }).default('normal'), // 'normal' | 'investigacion'
  id_esp: int("id_esp").references(() => especialistas.id),
});

// ─────────── Multimedia ───────────
export const multimedia = mysqlTable("multimedia", {
  id: int("id").primaryKey().autoincrement(),
  tipo: varchar("tipo", { length: 50 }).default('image'), // 'image', 'video', 'link'
  filename: varchar("filename", { length: 255 }), // Nombre del archivo (para imágenes)
  original_name: varchar("original_name", { length: 255 }), // Nombre original
  file_path: varchar("file_path", { length: 500 }), // Ruta completa del archivo
  file_size: int("file_size"), // Tamaño en bytes
  mime_type: varchar("mime_type", { length: 100 }), // image/jpeg, video/youtube, text/url, etc.
  url: varchar("url", { length: 1000 }), // URL para videos de YouTube o enlaces
  titulo: varchar("titulo", { length: 255 }), // Título para videos/enlaces
  descripcion: text("descripcion"), // Descripción para videos/enlaces
  id_post: int("id_post").references(() => posts.id),
});

// ─────────── Reacción ───────────
export const reacciones = mysqlTable("reaccion", {
  id_us: int("id_us").references(() => usuarios.id),
  id_post: int("id_post").references(() => posts.id),
  fecha: date("fecha"),
});

// ─────────── Progreso ───────────
export const progresos = mysqlTable("progreso", {
  id: int("id").primaryKey().autoincrement(),
  fecha: date("fecha"),
  etapa: varchar("etapa", { length: 255 }),
  id_pac: int("id_pac").references(() => pacientes.id),
});

// ─────────── Bitacora ───────────
export const bitacoras = mysqlTable("bitacora", {
  id: int("id").primaryKey().autoincrement(),
  fecha: date("fecha"),
  presion_ar: varchar("presion_ar", { length: 255 }),
  glucosa: decimal("glucosa", { precision: 10, scale: 2 }),
  id_pac: int("id_pac").references(() => pacientes.id),
  comidas: text("comidas"), // Movido al final
  medicamentos: text("medicamentos"), // Movido al final
});

