import {usersRepository} from "../../../user/repositories/user.repository";
import { addMinutes } from "date-fns";
import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import { nodemailerService } from "../../domain/nodemailer.service";
import { emailExamples } from "../../utils/email-messages";

export async function resendConfirmationEmail(
    req: Request<{}, {}, {email:string }>,
    res: Response,
    next: NextFunction): Promise<void> {
    try {
        const email = req.body.email;
        const user = await usersRepository.findByLoginOrEmail(email);
        if (!user) {
          res.status(HttpStatus.BadRequest).send({errorsMessages: [{ message: 'User with this email not found', field: "email" }] });
          return ;
        }

        if (user.emailConfirmation.isConfirmed){
          res.sendStatus(HttpStatus.NoContent);
          return ;
        }

        const newCode = crypto.randomUUID();
        const newExpiration = addMinutes(new Date(), 10).toISOString();
        await usersRepository.updateConfirmation(
            user._id.toString(),
            newCode,
            newExpiration
        );
      await nodemailerService.sendEmail(
        user.email,
        newCode,
        emailExamples.registrationEmail
      );
        res.sendStatus(HttpStatus.NoContent);
    }
    catch (error) {
        next(error);
    }
}