import {
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { ProductsService } from "./products.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProducts() {
    return await this.productsService.getAll();
  }

  @UseGuards(AuthGuard)
  @Post(":id")
  async verifyStockById(@Body() data: { id: string; quantity: number }) {
    const isAvailable = this.productsService.stockAvailable(
      data.id,
      data.quantity,
    );
    if (isAvailable) return { ok: true };
    throw new ConflictException("El stock seleccionado ya no está disponible.");
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  async updateStockById(
    @Body() data: { id: string; quantity: number; isDecrement: boolean },
  ) {
    return await this.productsService.updateById(
      data.id,
      data.quantity,
      data.isDecrement,
    );
  }
}
