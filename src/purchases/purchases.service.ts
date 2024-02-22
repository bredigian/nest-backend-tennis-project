import { PurchaseExtended, PurchaseStatus } from "src/types/purchase.types";
import { STRIPE_PUBLISHABLE_KEY, stripe } from "src/config/stripe";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { products } from "@prisma/client";

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async getPurchasesById(user_id: string) {
    const purchases = await this.prisma.purchases.findMany({
      where: {
        user_id,
      },
    });
    const data = await Promise.all(
      purchases.map((purchase) => {
        return new Promise(async (resolve) => {
          const product = await this.prisma.products.findUnique({
            where: {
              id: purchase.product_id,
            },
            select: {
              title: true,
              image: true,
              type: true,
            },
          });
          resolve({
            ...purchase,
            product_title: product.title,
            product_type: product.type,
            product_image: product.image,
          });
        });
      }),
    );
    return data as unknown as PurchaseExtended;
  }

  async createPurchase(
    payment_id: string,
    product: products,
    quantity: number,
    user_id: string,
  ) {
    const { id, price } = product;
    return this.prisma.purchases.create({
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
