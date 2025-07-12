import {CommentatorInfo} from "./CommentatorInfo";

export type Comment = {
    content: string;
    commentatorInfo: CommentatorInfo
    createdAt: string;
    postId: string;
}