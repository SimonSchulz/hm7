import {Request, Response, NextFunction} from "express";
import {authService} from "../../domain/auth.service";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function registrationHandler (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {login, email, password} = req.body;
        await authService.registerUser(login, password, email);
        res.send(HttpStatus.NoContent);
    }
    catch (e) {
        next(e);
    }
}