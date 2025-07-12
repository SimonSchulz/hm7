import { Router, Response, Request } from "express";
import { authMiddleware } from "../../auth/auth-middleware";
import { usersService } from "../domain/user.service";
import { HttpStatus } from "../../core/types/http-statuses";
import { usersQueryRepository } from "../repositories/user.query.repository";
import { UserViewModel } from "../dto/user.view-model";
import { passwordValidation } from "../validation/password.validation";
import { loginValidation } from "../validation/login.validation";
import { emailValidation } from "../validation/email.validation";
import { inputValidationResultMiddleware } from "../../core/utils/input-validtion-result.middleware";
import { InputUserDto } from "../dto/user.input-dto";
import {
  NotFoundError,
  ValidationError,
} from "../../core/utils/app-response-errors";
import { getUsersHandler } from "./handlers/get-users.handler";

export const usersRouter = Router({});
usersRouter.get("/", authMiddleware, getUsersHandler);

usersRouter.post(
  "/",
  authMiddleware,
  passwordValidation,
  loginValidation,
  emailValidation,
  inputValidationResultMiddleware,
  async (req: Request<{}, {}, InputUserDto>, res: Response<UserViewModel>) => {
    const { login, password, email } = req.body;
    const userId = await usersService.create({ login, password, email });
    const newUser = await usersQueryRepository.findById(userId);
    if (!newUser) {
      throw new ValidationError("Invalid user data");
    }
    res.status(HttpStatus.Created).send(newUser!);
  },
);

usersRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersService.delete(id);
    if (!user) throw new NotFoundError("User does not exist");
    res.sendStatus(HttpStatus.NoContent);
  },
);
