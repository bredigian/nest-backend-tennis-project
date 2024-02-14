import { compare, hash } from "bcrypt";

export const generateHash = async (password: string) => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};
