import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { user as User } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() data: User) {
    const { username, email } = data;

    const userExists = await this.authService.userExists(username, email);

    const hashedPassword = await this.authService.hashPassword(data?.password);
    if (!userExists)
      return this.authService.createUser({ ...data, password: hashedPassword });
    else throw new BadRequestException("El usuario ya existe.");
  }

  @Post("signin")
  async signin(@Body() data: User) {
    const { username, password } = data;
    const user: User = await this.authService.getUser(username);

    if (!user) throw new BadRequestException("Usuario no encontrado.");

    const isPasswordCorrect = await this.authService.comparePassword(
      password,
      user?.password,
    );

    if (!isPasswordCorrect)
      throw new UnauthorizedException("Contraseña incorrecta.");
    else {
      const token = await this.authService.createToken(user);
      return {
        user: {
          ...user,
          password: undefined,
        },
        token,
      };
    }
  }

  @Get("verify")
  async verifySession(@Headers("Authorization") token: string) {
    const verifiedToken = await this.authService.verifyToken(token);
    if (verifiedToken) {
      const user = await this.authService.getUserById(verifiedToken.user_id);
      return {
        user: {
          ...user,
          password: undefined,
        },
        token: verifiedToken,
      };
    } else throw new UnauthorizedException("La sesión ha caducado.");
  }

  @Delete("signout")
  async signout(@Headers("Authorization") id: string) {
    return await this.authService.deleteToken(id);
  }
}
