import {
  BadRequestException,
  Body,
  Controller,
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
    else
      return {
        ...user,
        password: undefined,
      };
  }
}
