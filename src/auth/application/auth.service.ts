import {bcryptService} from "./bcrypt.service";
import {usersRepository} from "../../user/repositories/user.repository";
import {AuthorizationError} from "../../core/utils/app-response-errors";
import {jwtService} from "./jwt.service";

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<string> {
    const user = await this.checkUserCredentials(
      loginOrEmail,
      password,
    );
    return await jwtService.createToken(user._id.toString());
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) throw new AuthorizationError('Wrong login or email');
    const isPassValid = await bcryptService.checkPassword(password, user.passwordHash);
    if (!isPassValid) throw new AuthorizationError('Wrong password');
    return user;
  },
};
