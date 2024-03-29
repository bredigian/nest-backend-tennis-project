import { Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductsModule, PurchasesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
