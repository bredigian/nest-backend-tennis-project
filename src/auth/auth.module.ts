import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
