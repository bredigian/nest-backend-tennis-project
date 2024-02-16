import { Body, Controller, Get, Post } from "@nestjs/common";
import { product as Product } from "@prisma/client";
import { PurchasesService } from "./purchases.service";

@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async getPurchases() {
    return "This will return all the purchases";
  }

  @Post()
  async createPurchase(
    @Body() purchase: { product: Product; quantity: number; user_id: string },
  ) {
    return await this.purchasesService.createPurchase(
      purchase.product,
      purchase.quantity,
      purchase.user_id,
    );
  }
}
