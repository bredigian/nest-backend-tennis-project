import { Injectable, NotFoundException } from "@nestjs/common";
import { compare, hash } from "bcrypt";

import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { SALT_ROUNDS } from "src/config/salt-rounds";
import { users } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: users) {
    const userCreated = await this.prisma.users.create({ data });
    const token = await this.createToken(userCreated);
    return {
      user: {
        ...userCreated,
        password: undefined,
      },
      token,
    };
  }

  async getUser(username: string) {
    return this.prisma.users.findFirst({
      where: {
        username,
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async userExists(username: string, email: string) {
    const userByUsername = await this.prisma.users.findFirst({
      where: {
        username,
      },
    });
    const userByEmail = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!userByUsername && !userByEmail) return false;
    else return true;
  }

  async createToken(user: users) {
    const token = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
    });
    return await this.prisma.tokens.create({
      data: {
        user_id: user.id,
        value: token,
      },
    });
  }

  async verifyToken(token: string) {
    const storedToken = await this.prisma.tokens.findFirst({
      where: {
        value: token,
      },
    });
    if (!storedToken) return false;

    const isValid = await this.jwtService.verifyAsync(token);
    return isValid ? storedToken : false;
  }

  async deleteToken(id: string) {
    try {
      return await this.prisma.tokens.delete({
        where: {
          id: id,
        },
      });
    } catch {
      throw new NotFoundException("El token no se encontró.");
    }
  }

  async hashPassword(password: string) {
    return await hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}
