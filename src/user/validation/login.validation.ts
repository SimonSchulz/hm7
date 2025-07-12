import { body } from "express-validator";
import { usersRepository } from "../repositories/user.repository";

export const loginValidation = body("login")
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Login must be between 3 and 10 characters")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage(
    "Login can only contain letters, numbers, underscores, and hyphens",
  )
  .custom(async (login: string) => {
    const user = await usersRepository.findByLoginOrEmail(login);
    if (user) {
      throw new Error("login already exist");
    }
    return true;
  });
