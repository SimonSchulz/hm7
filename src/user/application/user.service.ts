import { InputUserDto } from "../dto/user.input-dto";
import { bcryptService } from "../../auth/application/bcrypt.service";
import { User } from "../types/user";
import { usersRepository } from "../repositories/user.repository";

export const usersService = {
  async create(dto: InputUserDto): Promise<string> {
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser: User = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    const newUserId = await usersRepository.create(newUser);

    return newUserId;
  },

  async delete(id: string): Promise<boolean> {
    const user = await usersRepository.findById(id);
    if (!user) return false;

    return await usersRepository.delete(id);
  },
};
