CREATE DATABASE IF NOT EXISTS `storage`;

USE `storage`;

CREATE TABLE IF NOT EXISTS `order` (
	`id` INT(11) AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`contact` VARCHAR(255) NOT NULL,
	`pid` VARCHAR(64) NOT NULL,
	`shipping` DECIMAL(15, 2) NOT NULL,
	CONSTRAINT `pk_order` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `item` (
	`id` INT(11) AUTO_INCREMENT,
	`order` INT(11) NOT NULL,
	`sku` VARCHAR(32) NOT NULL,
	`price` DECIMAL(15, 2) NOT NULL,
	`description` VARCHAR(1024) NOT NULL,
	`amount` INT(9) NOT NULL,
	CONSTRAINT `pk_item` PRIMARY KEY (`sku`),
	CONSTRAINT `fk_item_order` FOREIGN KEY (`order`) REFERENCES `order`(`id`)
);