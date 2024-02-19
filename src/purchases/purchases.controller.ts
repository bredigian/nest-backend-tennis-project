import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { PurchasesService } from "./purchases.service";
import { product as Product } from "@prisma/client";

@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async getPurchases() {
    return "This will return all the purchases";
  }

  @Post()
  async createPurchase(
    @Body()
    data: {
      id: string;
      product: Product;
      quantity: number;
      user_id: string;
    },
  ) {
    return this.purchasesService.createPurchase(
      data.id,
      data.product,
      data.quantity,
      data.user_id,
    );
  }

  @Post("intent")
  async createIntent(
    @Body()
    purchase: {
      product_id: string;
      unit_price: number;
      quantity: number;
      user_id: string;
    },
  ) {
    const { id, client_secret } = await this.purchasesService.createPaymentLink(
      purchase.unit_price,
      purchase.quantity,
    );
    return { id, client_secret };
  }

  @Get("authorization")
  async getStripeKey() {
    const key = await this.purchasesService.getPublishableKey();
    return { key };
  }

  @Delete("cancel")
  async cancelIntent(@Body() data: { id: string }) {
    return await this.purchasesService.cancelIntent(data.id);
  }
}
