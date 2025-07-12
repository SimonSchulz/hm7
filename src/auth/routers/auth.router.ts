import { Router } from "express";
import { passwordValidation } from "../../user/validation/password.validation";
import { loginOrEmailValidation } from "../../user/validation/login.or.emaol.validation";
import { inputValidationResultMiddleware } from "../../core/utils/input-validtion-result.middleware";

import { authLoginHandler } from "./handlers/login.handler";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getUserDataHandler} from "./handlers/get-user-data.handler";
import {loginValidation} from "../../user/validation/login.validation";
import {emailValidation} from "../../user/validation/email.validation";
import {registrationHandler} from "./handlers/registration.handler";
import {resendConfirmationEmail} from "./handlers/email-resending.handler";
import { confirmRegistration } from "./handlers/registration-confirmation.handler";
import { codeValidation } from "../../user/validation/confirm-code.validation";

export const authRouter = Router();

authRouter.post(
  "/login",
  passwordValidation,
  loginOrEmailValidation,
  inputValidationResultMiddleware,
  authLoginHandler,
);
authRouter.post(
    "/registration-confirmation",
  codeValidation,
  confirmRegistration
);
authRouter.post(
    "/registration",
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    registrationHandler,
);
authRouter.post(
    "/registration-email-resending",
    emailValidation,
    resendConfirmationEmail
);
authRouter.get(
    '/auth/me',
    accessTokenGuard,
    getUserDataHandler,
);