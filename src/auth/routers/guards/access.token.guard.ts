import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../domain/jwt.service";
import {AuthorizationError} from "../../../core/utils/app-response-errors";
import { usersRepository } from "../../../user/repositories/user.repository";

export const accessTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      if (!req.headers.authorization) throw new AuthorizationError();

      const [authType, token] = req.headers.authorization.split(' ');

      if (authType !== 'Bearer' || !token) throw new AuthorizationError();

      const payload = await jwtService.verifyToken(token);
      console.log(payload);
      if (!payload?.userId) throw new AuthorizationError();
      const user = await usersRepository.findById(payload.userId);
      if (!user) throw new AuthorizationError();
      req.userInfo = {
        userId: user._id.toString(),
        userLogin: user.login,
      };
      next();
    }
    catch (error) {
      next(error);
    }
};