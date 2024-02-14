import { Controller, Get } from "@nestjs/common";

@Controller("purchases")
export class PurchasesController {
  constructor() {}

  @Get()
  async getPurchases() {
    return "This will return all the purchases";
  }
}
