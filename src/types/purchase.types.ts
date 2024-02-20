import { ProductType } from "./products.types";
import { purchase as Purchase } from "@prisma/client";

export enum PurchaseStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
}

export interface PurchaseExtended extends Purchase {
  product_title: string;
  product_type: ProductType;
  product_image: string;
}
