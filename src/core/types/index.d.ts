import { CommentatorInfo } from "../../comments/types/CommentatorInfo";

declare global {
  namespace Express {
    interface Request {
      userInfo?: CommentatorInfo;
    }
  }
}