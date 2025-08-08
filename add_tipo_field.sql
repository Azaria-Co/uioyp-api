-- Agregar campo tipo a la tabla post
ALTER TABLE `post` ADD COLUMN `tipo` varchar(20) DEFAULT 'normal';

-- Comentario: Este campo permite diferenciar entre posts normales e investigaciones
-- Valores posibles: 'normal', 'investigacion'
