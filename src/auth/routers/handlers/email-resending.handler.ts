import {usersRepository} from "../../../user/repositories/user.repository";
import {NotFoundError, ValidationError} from "../../../core/utils/app-response-errors";
import { addMinutes } from "date-fns";
import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {authService} from "../../domain/auth.service";

export async function resendConfirmationEmail(
    req: Request<{}, {}, {email:string }>,
    res: Response,
    next: NextFunction): Promise<void> {
    try {
        const email = req.body.email;
        const user = await usersRepository.findByLoginOrEmail(email);
        if (!user) throw new ValidationError('User not found');

        if (user.emailConfirmation.isConfirmed) throw new ValidationError('user already confirmed');

        const newCode = crypto.randomUUID();
        const newExpiration = addMinutes(new Date(), 10).toISOString();
        await usersRepository.updateConfirmation(
            user._id.toString(),
            newCode,
            newExpiration
        );
        await authService.confirmEmail(newCode);
        res.sendStatus(HttpStatus.NoContent);
    }
    catch (error) {
        next(error);
    }
}