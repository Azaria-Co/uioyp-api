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
  id_esp: int("id_esp").references(() => especialistas.id),
});

// ─────────── Multimedia ───────────
export const multimedia = mysqlTable("multimedia", {
  id: int("id").primaryKey().autoincrement(),
  tipo: text("tipo"), // Changed from blob to text
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
});