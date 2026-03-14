ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'REQUIRES_ACTION'::text;--> statement-breakpoint
DROP TYPE "public"."payment_status_enum";--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('succeeded', 'processing', 'canceled', 'requires_action');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'REQUIRES_ACTION'::"public"."payment_status_enum";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE "public"."payment_status_enum" USING "status"::"public"."payment_status_enum";