-- Actualizar tabla multimedia para que coincida con el schema
-- Ejecutar estas líneas una por una en tu MySQL

-- 1. Agregar las columnas que faltan
ALTER TABLE multimedia ADD COLUMN filename VARCHAR(255);
ALTER TABLE multimedia ADD COLUMN original_name VARCHAR(255);
ALTER TABLE multimedia ADD COLUMN file_path VARCHAR(500);
ALTER TABLE multimedia ADD COLUMN file_size INT;
ALTER TABLE multimedia ADD COLUMN mime_type VARCHAR(100);

-- 2. La columna 'tipo' ya no la necesitamos, pero la podemos dejar por compatibilidad
-- Si quieres eliminarla después puedes ejecutar:
-- ALTER TABLE multimedia DROP COLUMN tipo;

-- 3. Verificar que todo esté bien
-- DESCRIBE multimedia;