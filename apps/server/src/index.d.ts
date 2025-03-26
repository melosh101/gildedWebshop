import type { TProduct, TProductVariant, TIProduct, TIProductVariant } from "./db/schema";

export type TProduct = TProduct;
export type TProductVariant = TProductVariant;
export type TIProduct = TIProduct;
export type TIProductVariant = TIProductVariant;
export type TProductWithVariants = TProduct & { productVariant: TProductVariant[] };

export type TListResponse = {
    page: number;
    pageSize: number;
    maxPages: number;
    data: TProductWithVariants[];
}