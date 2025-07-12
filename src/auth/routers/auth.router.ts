import { Router } from "express";
import { passwordValidation } from "../../user/validation/password.validation";
import { loginOrEmailValidation } from "../../user/validation/login.or.emaol.validation";
import { inputValidationResultMiddleware } from "../../core/utils/input-validtion-result.middleware";

import { authLoginHandler } from "./handlers/login-handler";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getUserDataHandler} from "./handlers/get-user-data.handler";

export const authRouter = Router();

authRouter.post(
  "/login",
  passwordValidation,
  loginOrEmailValidation,
  inputValidationResultMiddleware,
  authLoginHandler,
);
authRouter.get(
    '/auth/me',
    accessTokenGuard,
    getUserDataHandler,
);