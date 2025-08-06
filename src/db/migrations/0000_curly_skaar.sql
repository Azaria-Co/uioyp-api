CREATE TABLE `bitacora` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fecha` date,
	`presion_ar` varchar(255),
	`glucosa` decimal(10,2),
	`id_pac` int,
	CONSTRAINT `bitacora_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `especialista` (
	`id` int AUTO_INCREMENT NOT NULL,
	`estatus` int,
	`area` varchar(255),
	`id_us` int,
	CONSTRAINT `especialista_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `multimedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255),
	`original_name` varchar(255),
	`file_path` varchar(500),
	`file_size` int,
	`mime_type` varchar(100),
	`id_post` int,
	CONSTRAINT `multimedia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paciente` (
	`id` int AUTO_INCREMENT NOT NULL,
	`masa_muscular` decimal(10,2),
	`tipo_sangre` varchar(3),
	`enfer_pat` varchar(255),
	`telefono` varchar(15),
	`id_us` int,
	CONSTRAINT `paciente_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(100),
	`fecha` date,
	`texto` text,
	`id_esp` int,
	CONSTRAINT `post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progreso` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fecha` date,
	`etapa` varchar(255),
	`id_pac` int,
	CONSTRAINT `progreso_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reaccion` (
	`id_us` int,
	`id_post` int,
	`fecha` date
);
--> statement-breakpoint
CREATE TABLE `usuario` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre_us` varchar(255),
	`rol` int NOT NULL,
	CONSTRAINT `usuario_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bitacora` ADD CONSTRAINT `bitacora_id_pac_paciente_id_fk` FOREIGN KEY (`id_pac`) REFERENCES `paciente`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `especialista` ADD CONSTRAINT `especialista_id_us_usuario_id_fk` FOREIGN KEY (`id_us`) REFERENCES `usuario`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `multimedia` ADD CONSTRAINT `multimedia_id_post_post_id_fk` FOREIGN KEY (`id_post`) REFERENCES `post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paciente` ADD CONSTRAINT `paciente_id_us_usuario_id_fk` FOREIGN KEY (`id_us`) REFERENCES `usuario`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post` ADD CONSTRAINT `post_id_esp_especialista_id_fk` FOREIGN KEY (`id_esp`) REFERENCES `especialista`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progreso` ADD CONSTRAINT `progreso_id_pac_paciente_id_fk` FOREIGN KEY (`id_pac`) REFERENCES `paciente`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reaccion` ADD CONSTRAINT `reaccion_id_us_usuario_id_fk` FOREIGN KEY (`id_us`) REFERENCES `usuario`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reaccion` ADD CONSTRAINT `reaccion_id_post_post_id_fk` FOREIGN KEY (`id_post`) REFERENCES `post`(`id`) ON DELETE no action ON UPDATE no action;