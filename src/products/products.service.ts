import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { products } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<products[]> {
    return await this.prisma.products.findMany();
  }

  async getById(id: string): Promise<products> {
    return await this.prisma.products.findUnique({
      where: {
        id,
      },
    });
  }

  async stockAvailable(id: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.products.findUnique({
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
  ): Promise<products> {
    return !isDecrement
      ? await this.prisma.products.update({
          where: {
            id,
          },
          data: {
            stock: {
              increment: quantity,
            },
          },
        })
      : await this.prisma.products.update({
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
