ALTER TABLE "products" RENAME COLUMN "price" TO "unit_price";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "unit_price";