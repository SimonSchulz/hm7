import {commentCollection } from "../../db/mongodb";
import {ObjectId, WithId} from "mongodb";
import {Comment} from "../types/comment";
import {CommentQueryInput} from "../types/comment-query.input";

export const commentsQueryRepository = {
    async findByIdOrFail(id: string):  Promise<WithId<Comment> | null>  {
        return commentCollection.findOne({_id: new ObjectId(id)});
    },
    async findCommentsByPostId(postId: string, queryDto: CommentQueryInput): Promise<{ items: WithId<Comment>[], totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        const filter = { postId };

        const items = await commentCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await commentCollection.countDocuments(filter);

        return { items, totalCount };
    },
};