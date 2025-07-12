import {Response, Request} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {usersQueryRepository} from "../../../user/repositories/user.query.repository";

export async function getUserDataHandler (req: Request, res: Response){
    const userId = res.locals.user.id;
    const me = await usersQueryRepository.findById(userId);
    res.status(HttpStatus.Ok).send({userId: me?.id, login: me?.login, email: me?.email});
}