PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sightings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`observer_id` integer NOT NULL,
	`entered_by_observer_id` integer,
	`distance_type` text NOT NULL,
	`guesstimated_distance` real DEFAULT 0 NOT NULL,
	`reticule` real DEFAULT 0 NOT NULL,
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
	`survey_code` text DEFAULT '' NOT NULL,
	`waypoint_id` text DEFAULT '' NOT NULL,
	`beaufort_sea_state` integer DEFAULT 0 NOT NULL,
	`visibility_scale` integer DEFAULT 0 NOT NULL,
	`douglas_sea_state` integer DEFAULT 0 NOT NULL,
	`observed_at` text NOT NULL,
	`comments` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`observer_id`) REFERENCES `observers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entered_by_observer_id`) REFERENCES `observers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sightings`("id", "observer_id", "entered_by_observer_id", "distance_type", "guesstimated_distance", "reticule", "angle", "n_min", "n_max", "n_optim", "species_id", "response", "latitude", "longitude", "gps_accuracy", "has_photos", "photo_keys", "platform", "survey_code", "waypoint_id", "beaufort_sea_state", "visibility_scale", "douglas_sea_state", "observed_at", "comments", "created_at") SELECT "id", "observer_id", "entered_by_observer_id", "distance_type", "guesstimated_distance", "reticule", "angle", "n_min", "n_max", "n_optim", "species_id", "response", "latitude", "longitude", "gps_accuracy", "has_photos", "photo_keys", "platform", "survey_code", "waypoint_id", "beaufort_sea_state", "visibility_scale", "douglas_sea_state", "observed_at", "comments", "created_at" FROM `sightings`;--> statement-breakpoint
DROP TABLE `sightings`;--> statement-breakpoint
ALTER TABLE `__new_sightings` RENAME TO `sightings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_sightings_observed_at` ON `sightings` (`observed_at`);--> statement-breakpoint
CREATE INDEX `idx_sightings_observer_id` ON `sightings` (`observer_id`);--> statement-breakpoint
CREATE INDEX `idx_sightings_entered_by_observer_id` ON `sightings` (`entered_by_observer_id`);--> statement-breakpoint
CREATE INDEX `idx_sightings_species_id` ON `sightings` (`species_id`);