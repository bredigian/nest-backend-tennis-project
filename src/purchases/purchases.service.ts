import { GeneratedPaymentLink, Preference } from "src/types/purchase.types";

import { Injectable } from "@nestjs/common";
import { MERCADOPAGO_ACCESS_TOKEN } from "src/config/mercadopago";
import { MERCADOPAGO_API_URL } from "src/config/mercadopago";
import { PrismaService } from "src/prisma/prisma.service";
import { product as Product } from "@prisma/client";

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async generatePayment(product: Product, quantity: number) {
    const preferences: Preference = {
      items: [
        {
          id: product.id,
          title: product.title,
          description: product.title,
          picture_url: product.image,
          category_id: product.type,
          quantity: quantity,
          currency_id: "ARS",
          unit_price: product.price,
        },
      ],
    };
    const response = await fetch(MERCADOPAGO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferences),
    });
    const { date_created, id, init_point }: GeneratedPaymentLink =
      (await response.json()) as GeneratedPaymentLink;
    return { date_created, id, init_point } as GeneratedPaymentLink;
  }
}
