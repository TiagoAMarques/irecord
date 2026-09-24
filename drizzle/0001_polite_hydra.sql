CREATE TABLE `auth_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`observer_id` integer NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`observer_id`) REFERENCES `observers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_observer_id` ON `auth_sessions` (`observer_id`);--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_expires_at` ON `auth_sessions` (`expires_at`);--> statement-breakpoint
ALTER TABLE `observers` ADD `is_admin` integer DEFAULT false NOT NULL;