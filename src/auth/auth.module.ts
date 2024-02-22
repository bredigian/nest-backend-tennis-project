import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWT_SECRET } from "src/config/jwt";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "1d",
      },
    }),
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
