import { Module } from "@nestjs/common";
import { PurchasesController } from "./purchases.controller";
import { PurchasesService } from "./purchases.service";

@Module({
  providers: [PurchasesService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
