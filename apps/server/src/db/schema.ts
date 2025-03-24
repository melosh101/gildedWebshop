import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { text, integer, pgTable } from "drizzle-orm/pg-core";

export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"])
export const genderEnum = pgEnum("gender", ["Male", "Female", "Unisex"])
export const categoryEnum = pgEnum("categories", ["Shirt", "Pants", "Shoes", "Accessories"])

export const productTable = pgTable("product", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    category: categoryEnum().default("Shirt"),
    name: text().notNull(),
    price: text().notNull(),
    description: text().notNull(),
    gender: genderEnum().default("Unisex"),
    image: text().notNull(),
})

export const productVariantTable = pgTable("product_variant", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    productId: integer().notNull(),
    price: text().notNull(),
    size: sizeEnum().default("M"),
})

export type TProductVariant = typeof productVariantTable.$inferSelect
export type TProduct = typeof productTable.$inferSelect

export const productRelation = relations(productTable, ({many}) => ({
    productVariant: many(productVariantTable)
}))

export const productVariantRelation = relations(productVariantTable, ({one}) => ({
    product: one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id]
    })
}))