import { Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { PurchasesModule } from "./purchases/purchases.module";

@Module({
  imports: [ProductsModule, PurchasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
