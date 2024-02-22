import { ProductType } from "./products.types";
import { purchases } from "@prisma/client";

export enum PurchaseStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
}

export interface PurchaseExtended extends purchases {
  product_title: string;
  product_type: ProductType;
  product_image: string;
}
