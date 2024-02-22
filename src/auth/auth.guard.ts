import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { JWT_SECRET } from "src/config/jwt";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token)
      throw new UnauthorizedException("No tienes los permisos necesarios.");
    try {
      const storedToken = await this.findToken(token);
      await this.jwtService.verifyAsync(storedToken.value, {
        secret: JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException(
        "El token recibido es inválido o ya caducó.",
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  async findToken(token: string) {
    return await this.prismaService.tokens.findFirst({
      where: {
        value: token,
      },
    });
  }
}
