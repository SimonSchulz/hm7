import {Request, Response, NextFunction} from "express";
import {authService} from "../../domain/auth.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import { ValidationError } from "../../../core/utils/app-response-errors";
import { usersRepository } from "../../../user/repositories/user.repository";
import { emailExamples } from "../../utils/email-messages";
import { nodemailerService } from "../../domain/nodemailer.service";

export async function registrationHandler (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {login, email, password} = req.body;
        const id = await authService.registerUser(login, password, email);
        if(!id) throw new ValidationError("Invalid data");

        const user = await usersRepository.findById(id);
        if (!user) throw new ValidationError("Invalid data");
        if (user) {

          await nodemailerService.sendEmail(
            user.email,
            user.emailConfirmation.confirmationCode,
            emailExamples.registrationEmail
          );
        }
        res.sendStatus(HttpStatus.NoContent);
    }
    catch (e) {
        next(e);
        console.log(e)
    }
}