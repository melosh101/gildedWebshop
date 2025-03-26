ALTER TABLE "product" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gender_idx" ON "product" USING btree ("gender");--> statement-breakpoint
CREATE INDEX "category_idx" ON "product" USING btree ("category");--> statement-breakpoint
CREATE INDEX "name_idx" ON "product" USING btree ("name");--> statement-breakpoint
ALTER TABLE "public"."product" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."categories";--> statement-breakpoint
CREATE TYPE "public"."categories" AS ENUM('Skjorter', 'Jakker', 'T-shirts', 'Accessories', 'Kjoler', 'Toppe', 'Bukser', 'Sweatere');--> statement-breakpoint
ALTER TABLE "public"."product" ALTER COLUMN "category" SET DATA TYPE "public"."categories" USING "category"::"public"."categories";