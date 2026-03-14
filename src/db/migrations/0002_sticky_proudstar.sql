CREATE TYPE "public"."currency_enum" AS ENUM('EUR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_method_enum" AS ENUM('MEETUP', 'SHIPPING');--> statement-breakpoint
CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('SUCCEEDED', 'FAILED', 'CANCELLED', 'REQUIRES_ACTION');--> statement-breakpoint
CREATE TYPE "public"."product_status_enum" AS ENUM('AVAILABLE', 'RESERVED', 'SOLD');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"unit_price" integer NOT NULL,
	"currency" "currency_enum" DEFAULT 'EUR' NOT NULL,
	"status" "order_status_enum" DEFAULT 'PENDING' NOT NULL,
	"fulfillment_method" "fulfillment_method_enum" DEFAULT 'MEETUP',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"provider" varchar(30) DEFAULT 'INTERNAL' NOT NULL,
	"provider_reference" varchar(255),
	"amount" integer NOT NULL,
	"currency" "currency_enum" DEFAULT 'EUR' NOT NULL,
	"status" "payment_status_enum" DEFAULT 'REQUIRES_ACTION' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "seller_profiles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_profiles" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "seller_profiles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_profiles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status_enum" DEFAULT 'AVAILABLE' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reserved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reserved_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_id_seller_profiles_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_buyer_id_index" ON "orders" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "orders_seller_id_index" ON "orders" USING btree ("seller_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_orders_product_index" ON "orders" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "orders_status_index" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_payments_order_index" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payments_status_index" ON "payments" USING btree ("status");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_reserved_by_user_id_users_id_fk" FOREIGN KEY ("reserved_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_seller_id_index" ON "products" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "product_status_index" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_reserved_by_index" ON "products" USING btree ("reserved_by_user_id");