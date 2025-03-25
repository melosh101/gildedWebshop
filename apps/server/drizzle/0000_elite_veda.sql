CREATE TYPE "public"."categories" AS ENUM('Skjorter', 'T-shirts', 'Accessories', 'Kjoler', 'Toppe', 'Bukser', 'Sweatere', 'Jakker');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Unisex');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL');--> statement-breakpoint
CREATE TABLE "product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category" "categories" NOT NULL,
	"name" text NOT NULL,
	"price" text NOT NULL,
	"description" text NOT NULL,
	"gender" "gender" DEFAULT 'Unisex',
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_variant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"productId" integer NOT NULL,
	"price" text NOT NULL,
	"size" "size" DEFAULT 'M'
);
