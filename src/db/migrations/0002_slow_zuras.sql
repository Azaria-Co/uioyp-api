ALTER TABLE `bitacora` ADD `comidas` text;--> statement-breakpoint
ALTER TABLE `bitacora` ADD `medicamentos` text;--> statement-breakpoint
ALTER TABLE `multimedia` ADD `tipo` varchar(50) DEFAULT 'image';--> statement-breakpoint
ALTER TABLE `multimedia` ADD `url` varchar(1000);--> statement-breakpoint
ALTER TABLE `multimedia` ADD `titulo` varchar(255);--> statement-breakpoint
ALTER TABLE `multimedia` ADD `descripcion` text;