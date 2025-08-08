-- Fix multimedia table by adding missing columns if they don't exist

-- Check if multimedia table exists, if not create it
CREATE TABLE IF NOT EXISTS `multimedia` (
    `id` int AUTO_INCREMENT NOT NULL,
    CONSTRAINT `multimedia_id` PRIMARY KEY(`id`)
);

-- Add columns one by one if they don't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'multimedia' 
     AND column_name = 'filename' 
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Column filename already exists'",
    "ALTER TABLE multimedia ADD COLUMN filename varchar(255)"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'multimedia' 
     AND column_name = 'original_name' 
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Column original_name already exists'",
    "ALTER TABLE multimedia ADD COLUMN original_name varchar(255)"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'multimedia' 
     AND column_name = 'file_path' 
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Column file_path already exists'",
    "ALTER TABLE multimedia ADD COLUMN file_path varchar(500)"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'multimedia' 
     AND column_name = 'file_size' 
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Column file_size already exists'",
    "ALTER TABLE multimedia ADD COLUMN file_size int"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'multimedia' 
     AND column_name = 'mime_type' 
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Column mime_type already exists'",
    "ALTER TABLE multimedia ADD COLUMN mime_type varchar(100)"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'multimedia' 
     AND column_name = 'id_post' 
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Column id_post already exists'",
    "ALTER TABLE multimedia ADD COLUMN id_post int"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE table_name = 'multimedia' 
     AND constraint_name = 'multimedia_id_post_post_id_fk'
     AND table_schema = DATABASE()) > 0,
    "SELECT 'Foreign key already exists'",
    "ALTER TABLE multimedia ADD CONSTRAINT multimedia_id_post_post_id_fk FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE no action ON UPDATE no action"
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;