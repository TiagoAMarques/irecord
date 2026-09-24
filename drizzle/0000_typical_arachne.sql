CREATE TABLE `observers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `observers_name_unique` ON `observers` (`name`);--> statement-breakpoint
CREATE TABLE `sightings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`observer_id` integer NOT NULL,
	`distance_type` text NOT NULL,
	`angle` real NOT NULL,
	`n_min` integer NOT NULL,
	`n_max` integer NOT NULL,
	`n_optim` integer NOT NULL,
	`species_id` integer NOT NULL,
	`response` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`gps_accuracy` real,
	`has_photos` integer DEFAULT false NOT NULL,
	`photo_keys` text DEFAULT '[]' NOT NULL,
	`platform` text NOT NULL,
	`observed_at` text NOT NULL,
	`comments` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`observer_id`) REFERENCES `observers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sightings_observed_at` ON `sightings` (`observed_at`);--> statement-breakpoint
CREATE INDEX `idx_sightings_observer_id` ON `sightings` (`observer_id`);--> statement-breakpoint
CREATE INDEX `idx_sightings_species_id` ON `sightings` (`species_id`);--> statement-breakpoint
CREATE TABLE `species` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`common_name` text NOT NULL,
	`scientific_name` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `species_common_name_unique` ON `species` (`common_name`);
--> statement-breakpoint
PRAGMA optimize;
