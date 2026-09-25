ALTER TABLE `sightings` ADD `survey_code` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `sightings` ADD `beaufort_sea_state` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `sightings` ADD `visibility_scale` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `sightings` ADD `douglas_sea_state` integer DEFAULT 0 NOT NULL;