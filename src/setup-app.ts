import express, { Express } from "express";
import {
  AUTH_PATH,
  BLOGS_PATH, COMMENT_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USER_PATH,
} from "./core/paths/paths";
import { postsRouter } from "./posts/routers/posts.router";
import { blogsRouter } from "./blogs/routers/blogs.router";
import { testingRouter } from "./testing/testing.router";
import { errorHandlerMiddleware } from "./core/utils/error-handler-middleware";
import { usersRouter } from "./user/routers/users.router";
import { authRouter } from "./auth/routers/auth.router";
import {commentsRouter} from "./comments/routers/comment.router";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("hello world!!!");
  });
  app.use(AUTH_PATH, authRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(USER_PATH, usersRouter);
  app.use(COMMENT_PATH, commentsRouter);
  app.use(TESTING_PATH, testingRouter);
  // @ts-ignore
  app.use(errorHandlerMiddleware);
  return app;
};
