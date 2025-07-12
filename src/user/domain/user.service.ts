import {InputUserDto} from "../dto/user.input-dto";
import {bcryptService} from "../../auth/domain/bcrypt.service";
import {usersRepository} from "../repositories/user.repository";
import {User} from "./user.entity";

export const usersService = {
  async create(dto: InputUserDto): Promise<string> {
    const { login, password, email } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User(login, email, passwordHash);
    return await usersRepository.create(newUser);
  },

  async delete(id: string): Promise<boolean> {
    const user = await usersRepository.findById(id);
    if (!user) return false;

    return await usersRepository.delete(id);
  },
};
