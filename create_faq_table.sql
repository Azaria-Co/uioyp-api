-- Crear tabla de Preguntas Frecuentes (FAQ)
CREATE TABLE IF NOT EXISTS `faq` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pregunta` TEXT NOT NULL,
  `respuesta` TEXT NOT NULL,
  `id_esp` INT,
  FOREIGN KEY (`id_esp`) REFERENCES `especialistas`(`id`) ON DELETE SET NULL
);

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO `faq` (`pregunta`, `respuesta`, `id_esp`) VALUES
('¿Qué es la rehabilitación física?', 'La rehabilitación física es un proceso terapéutico que busca restaurar la función y movilidad del paciente después de una lesión o cirugía.', NULL),
('¿Cuánto tiempo dura una sesión de terapia?', 'Las sesiones de terapia suelen durar entre 45 minutos y 1 hora, dependiendo del tipo de tratamiento y las necesidades del paciente.', NULL),
('¿Necesito una orden médica para recibir terapia?', 'Sí, en la mayoría de los casos se requiere una orden médica para recibir servicios de rehabilitación física.', NULL); 