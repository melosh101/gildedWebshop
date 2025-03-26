import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { text, integer, pgTable } from "drizzle-orm/pg-core";

export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"])
export const genderEnum = pgEnum("gender", ["Male", "Female", "Unisex"])

export const categoryEnum = pgEnum("categories", ["Skjorter", "Jakker", "T-shirts", "Accessories","Kjoler" ,"Toppe" ,"Bukser" ,"Sweatere", "Sko"])
export const productTable = pgTable("product", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    category: categoryEnum().notNull(),
    name: text().notNull(),
    price: text().notNull(),
    description: text().notNull(),
    gender: genderEnum().default("Unisex").notNull(),
    image: text().notNull(),
}, (t) => [
    index("gender_idx").on(t.gender),
    index("category_idx").on(t.category),
    index("name_idx").on(t.name),
])

export const productVariantTable = pgTable("product_variant", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    productId: integer().notNull().references(() => productTable.id),
    price: text().notNull(),
    size: sizeEnum().default("M"),
})

export type TProductVariant = typeof productVariantTable.$inferSelect
export type TProduct = typeof productTable.$inferSelect

export type TIProduct = typeof productTable.$inferInsert
export type TIProductVariant = typeof productVariantTable.$inferInsert

export const productRelation = relations(productTable, ({many}) => ({
    productVariant: many(productVariantTable)
}))

export const productVariantRelation = relations(productVariantTable, ({one}) => ({
    product: one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id]
    })
}))