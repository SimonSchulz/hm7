import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../domain/jwt.service";
import {AuthorizationError} from "../../../core/utils/app-response-errors";
import {usersQueryRepository} from "../../../user/repositories/user.query.repository";

export const accessTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    if (!req.headers.authorization)  throw new AuthorizationError();

    const [authType, token] = req.headers.authorization.split(' ');

    if (authType !== 'Bearer' || !token)  throw new AuthorizationError();

    const payload = await jwtService.verifyToken(token);
    if (!payload?.userId) throw new AuthorizationError();
    const user = await usersQueryRepository.findById(payload.userId);
    res.locals.user = {
        userId: user!.id,
        userLogin: user!.login,
    };
    next();
};