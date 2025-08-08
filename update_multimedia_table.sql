-- Script para actualizar la tabla multimedia de forma segura
-- Ejecutar este script en tu cliente MySQL

USE uioyp;

-- Agregar las nuevas columnas a la tabla multimedia existente
ALTER TABLE multimedia 
ADD COLUMN filename VARCHAR(255) AFTER id,
ADD COLUMN original_name VARCHAR(255) AFTER filename,
ADD COLUMN file_path VARCHAR(500) AFTER original_name,
ADD COLUMN file_size INT AFTER file_path,
ADD COLUMN mime_type VARCHAR(100) AFTER file_size;

-- Renombrar la columna tipo a backup_tipo (por si necesitas los datos)
ALTER TABLE multimedia 
CHANGE COLUMN tipo backup_tipo TEXT;

-- Si no necesitas los datos de la columna tipo, puedes eliminarla:
-- ALTER TABLE multimedia DROP COLUMN backup_tipo;

-- Verificar la nueva estructura
DESCRIBE multimedia;