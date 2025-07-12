import {Request, Response, NextFunction} from "express";
import {authService} from "../../domain/auth.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import { ValidationError } from "../../../core/utils/app-response-errors";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../auth-middleware";
import { usersRepository } from "../../../user/repositories/user.repository";

export async function registrationHandler (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {login, email, password} = req.body;
        const id = await authService.registerUser(login, password, email);
        if(!id) throw new ValidationError("Invalid data");
        const auth = req.headers['authorization'] as string;
        if (auth) {
          const [authType, token] = auth.split(' ');
          if(authType == 'Basic'){
            const credentials = Buffer.from(token, 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');
            if (username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
              const success = await usersRepository.confirmUser(id);
              if (!success) {
                throw new ValidationError("Failed to confirm user");
              }
            }
          }
        }
        res.sendStatus(HttpStatus.NoContent);
    }
    catch (e) {
        next(e);
    }
}