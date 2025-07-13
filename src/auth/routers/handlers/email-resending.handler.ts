import { usersRepository } from "../../../user/repositories/user.repository";
import { addMinutes, isAfter } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { nodemailerService } from "../../domain/nodemailer.service";
import { emailExamples } from "../../utils/email-messages";

export async function resendConfirmationEmail(
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const email = req.body.email;
    const user = await usersRepository.findByLoginOrEmail(email);
    if (!user) {
      res.sendStatus(HttpStatus.NoContent);
      return;
    }

    if (user.emailConfirmation.isConfirmed) {
      res.status(HttpStatus.BadRequest).send({
        errorsMessages: [
          { field: "email", message: "Email is already confirmed" },
        ],
      });
      return;
    }
    const now = new Date();
    const existingCode = user.emailConfirmation.confirmationCode;
    const expiration = new Date(user.emailConfirmation.expirationDate);

    let codeToSend = existingCode;

    if (!isAfter(expiration, now)) {
      codeToSend = crypto.randomUUID();
      const newExpiration = addMinutes(now, 10).toISOString();

      await usersRepository.updateConfirmation(
        user._id.toString(),
        codeToSend,
        newExpiration,
      );
      await new Promise(r => setTimeout(r, 3000))
    }
    await nodemailerService.sendEmail(
      user.email,
      codeToSend,
      emailExamples.registrationEmail);
    res.sendStatus(HttpStatus.NoContent);
    return;
  } catch (error) {
    next(error);
  }
}
