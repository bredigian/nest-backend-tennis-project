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

  async stockAvailable(id: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    return product?.stock <= quantity;
  }

  async updateById(
    id: string,
    quantity: number,
    isDecrement: boolean,
  ): Promise<Product> {
    return !isDecrement
      ? await this.prisma.product.update({
          where: {
            id,
          },
          data: {
            stock: {
              increment: quantity,
            },
          },
        })
      : await this.prisma.product.update({
          where: {
            id,
          },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });
  }
}
