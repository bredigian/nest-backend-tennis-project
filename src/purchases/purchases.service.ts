import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { product as Product } from "@prisma/client";
import { PurchaseStatus } from "src/types/purchase.types";

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase(product: Product, quantity: number, user_id: string) {
    const { id, price } = product;
    return this.prisma.purchase.create({
      data: {
        product_id: id,
        unit_price: price,
        quantity,
        total: price * quantity,
        user_id,
        status: PurchaseStatus.PENDING,
      },
    });
  }
}
