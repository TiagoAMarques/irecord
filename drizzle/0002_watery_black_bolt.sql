ALTER TABLE `sightings` ADD `entered_by_observer_id` integer REFERENCES observers(id);--> statement-breakpoint
CREATE INDEX `idx_sightings_entered_by_observer_id` ON `sightings` (`entered_by_observer_id`);
