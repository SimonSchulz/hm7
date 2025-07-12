import { NextFunction, Request, Response } from "express";
import { UserQueryInput } from "../../types/user-query.input";
import { setSortAndPagination } from "../../../core/helpers/set-sort-and-pagination";
import { usersQueryRepository } from "../../repositories/user.query.repository";
import { NotFoundError } from "../../../core/utils/app-response-errors";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = setSortAndPagination(req.query);
    const allUsers = await usersQueryRepository.findAllUsers(
      query as UserQueryInput,
    );
    if (!allUsers) throw new NotFoundError();
    res.status(HttpStatus.Ok).send(allUsers);
  } catch (e: unknown) {
    next(e);
  }
}
