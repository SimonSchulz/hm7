import {bcryptService} from "./bcrypt.service";
import {usersRepository} from "../../user/repositories/user.repository";
import {AuthorizationError, ValidationError} from "../../core/utils/app-response-errors";
import {jwtService} from "./jwt.service";
import { User } from "../../user/domain/user.entity";
import {nodemailerService} from "./nodemailer.service";
import {emailExamples} from "../utils/email-messages";
import {HttpStatus} from "../../core/types/http-statuses";

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

  async registerUser(
      login: string,
      pass: string,
      email: string
  ): Promise<void> {
    const isUser = await usersRepository.checkExistByLoginOrEmail(login, email);
    if (isUser) throw new ValidationError('User with this login or email exists');
    const passwordHash = await bcryptService.generateHash(pass);
    const newUser = new User(login, email, passwordHash);
    await usersRepository.create(newUser);

    nodemailerService
        .sendEmail(
            newUser.email,
            newUser.emailConfirmation.confirmationCode,
            emailExamples.registrationEmail
        )
        .catch(er => console.error('error in send email:', er));
  },

  async confirmEmail(code: string) {
    const isUuid = new RegExp(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ).test(code);

    if (!isUuid) {
      throw new ValidationError('Invalid code');
    }
  },

};
