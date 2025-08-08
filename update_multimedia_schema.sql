-- Actualizar tabla multimedia para soportar videos y enlaces
ALTER TABLE `multimedia` ADD COLUMN `tipo` varchar(50) DEFAULT 'image';
ALTER TABLE `multimedia` ADD COLUMN `url` varchar(1000);
ALTER TABLE `multimedia` ADD COLUMN `titulo` varchar(255);
ALTER TABLE `multimedia` ADD COLUMN `descripcion` text;

-- Comentarios sobre los tipos:
-- tipo = 'image': Imagen subida (usa filename, file_path)
-- tipo = 'video': Video de YouTube (usa url, titulo, descripcion)
-- tipo = 'link': Enlace externo (usa url, titulo, descripcion)
