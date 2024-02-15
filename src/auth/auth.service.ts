import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

import { Injectable } from "@nestjs/common";
import { JWT_SECRET } from "src/config/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { SALT_ROUNDS } from "src/config/salt-rounds";
import { user as User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: User) {
    const userCreated = this.prisma.user.create({ data });
    const token = await this.createToken(data);
    return {
      ...userCreated,
      password: undefined,
      token: token.value,
    };
  }

  async getUser(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async userExists(username: string, email: string) {
    const userByUsername = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
    const userByEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!userByUsername && !userByEmail) return false;
    else return true;
  }

  async createToken(user: User) {
    const token = sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "30d",
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

    const isValid = verify(token, JWT_SECRET);
    return isValid ? storedToken : false;
  }

  async hashPassword(password: string) {
    return await hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}
