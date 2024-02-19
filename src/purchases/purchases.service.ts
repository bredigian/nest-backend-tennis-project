import { STRIPE_PUBLISHABLE_KEY, stripe } from "src/config/stripe";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { product as Product } from "@prisma/client";
import { PurchaseStatus } from "src/types/purchase.types";

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase(
    payment_id: string,
    product: Product,
    quantity: number,
    user_id: string,
  ) {
    const { id, price } = product;
    return this.prisma.purchase.create({
      data: {
        id: payment_id,
        product_id: id,
        unit_price: price,
        quantity,
        total: price * quantity,
        user_id,
        status: PurchaseStatus.SUCCESS,
      },
    });
  }

  async createPaymentLink(unit_price: number, quantity: number) {
    return await stripe.paymentIntents.create({
      amount: Math.floor(unit_price * quantity * 100),
      currency: "usd",
    });
  }

  async getPublishableKey() {
    return STRIPE_PUBLISHABLE_KEY;
  }

  async cancelIntent(id: string) {
    return await stripe.paymentIntents.cancel(id);
  }
}
