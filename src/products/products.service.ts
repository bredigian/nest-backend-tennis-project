import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { product as Product } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async getById(id: string): Promise<Product> {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async updateById(
    id: string,
    stock: number,
    quantity: number,
  ): Promise<Product> {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        stock: stock - quantity,
      },
    });
  }
}
