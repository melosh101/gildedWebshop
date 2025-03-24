CREATE TYPE "categories" AS ENUM ('Shirt', 'Pants', 'Shoes', 'Accessories');
CREATE TYPE "gender" AS ENUM ('Male', 'Female', 'Unisex');
CREATE TYPE "size" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

CREATE TABLE "product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category" "categories" DEFAULT 'Shirt',
	"name" text NOT NULL,
	"price" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_variant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"productId" integer NOT NULL,
	"gender" "gender" DEFAULT 'Unisex',
	"price" text NOT NULL,
	"size" "size" DEFAULT 'M'
);
