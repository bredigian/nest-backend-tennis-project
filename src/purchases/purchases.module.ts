import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PurchasesController } from "./purchases.controller";
import { PurchasesService } from "./purchases.service";

@Module({
  providers: [PurchasesService, PrismaService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
