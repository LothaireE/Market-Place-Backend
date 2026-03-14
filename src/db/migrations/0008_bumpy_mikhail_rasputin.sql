CREATE TABLE "payment_orders" (
	"payment_id" uuid NOT NULL,
	"order_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "currency" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'EUR'::text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "currency" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'EUR'::text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "currency" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "currency" SET DEFAULT 'EUR'::text;--> statement-breakpoint
DROP TYPE "public"."currency_enum";--> statement-breakpoint
CREATE TYPE "public"."currency_enum" AS ENUM('EUR');--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "currency" SET DATA TYPE "public"."currency_enum" USING "currency"::"public"."currency_enum";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'EUR'::"public"."currency_enum";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE "public"."currency_enum" USING "currency"::"public"."currency_enum";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'EUR'::"public"."currency_enum";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "currency" SET DATA TYPE "public"."currency_enum" USING "currency"::"public"."currency_enum";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "currency" SET DEFAULT 'EUR'::"public"."currency_enum";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "currency" SET DATA TYPE "public"."currency_enum" USING "currency"::"public"."currency_enum";--> statement-breakpoint
DROP INDEX "unique_payments_order_index";--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "currency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "buyer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_payment_orders_order" ON "payment_orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payment_orders_payment_index" ON "payment_orders" USING btree ("order_id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_payments_provider_reference" ON "payments" USING btree ("provider","provider_reference");--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "order_id";