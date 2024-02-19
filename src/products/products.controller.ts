import {
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
} from "@nestjs/common";

import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return await this.productsService.getAll();
  }

  @Post(":id")
  async verifyStockById(@Body() data: { id: string; quantity: number }) {
    const isAvailable = this.productsService.stockAvailable(
      data.id,
      data.quantity,
    );
    if (isAvailable) return { ok: true };
    throw new ConflictException("El stock seleccionado ya no está disponible.");
  }

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
