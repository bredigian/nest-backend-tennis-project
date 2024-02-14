import { compare, hash } from "bcrypt";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SALT_ROUNDS } from "src/config/salt-rounds";
import { user as User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: User) {
    const userCreated = this.prisma.user.create({ data });
    return {
      ...userCreated,
      password: undefined,
    };
  }

  async getUser(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username,
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

  async hashPassword(password: string) {
    return await hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}
