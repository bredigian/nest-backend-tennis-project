import { Body, Controller, Get, Post } from "@nestjs/common";
import { PurchasesService } from "./purchases.service";

@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async getPurchases() {
    return "This will return all the purchases";
  }

  @Post()
  async createIntent(
    @Body()
    purchase: {
      product_id: string;
      unit_price: number;
      quantity: number;
      user_id: string;
    },
  ) {
    const { client_secret } = await this.purchasesService.createPaymentLink(
      purchase.unit_price,
      purchase.quantity,
    );
    return { client_secret };
  }

  @Get("authorization")
  async getStripeKey() {
    const key = await this.purchasesService.getPublishableKey();
    return { key };
  }
}
