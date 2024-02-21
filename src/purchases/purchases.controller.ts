import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PurchasesService } from "./purchases.service";
import { product as Product } from "@prisma/client";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPurchases(@Query("id") user_id: string) {
    if (user_id) return this.purchasesService.getPurchasesById(user_id);
    throw new ForbiddenException("Es necesario el ID del usuario.");
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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
