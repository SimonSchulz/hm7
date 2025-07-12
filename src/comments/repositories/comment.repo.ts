import { commentCollection } from "../../db/mongodb";
import {ObjectId, WithId} from "mongodb";
import {Comment} from "../types/comment";
import { CommentInputDto} from "../dto/comment.input-dto";

export const commentsRepository = {
    async findByIdOrFail(id: string):  Promise<WithId<Comment> | null>  {
        return commentCollection.findOne({_id: new ObjectId(id)});
    },

    async create(newComment: Comment): Promise<WithId<Comment>> {
        const insertResult = await commentCollection.insertOne(newComment);
        return { ...newComment, _id: insertResult.insertedId };
    },
    async delete(id: string): Promise <void> {
        const deleteResult = await commentCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Comment not exist');
        }
        return;
    },
    async update(id: string, dto: CommentInputDto): Promise<void> {
        const updateResult = await commentCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    content: dto.content,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Post not exist');
        }
        return;
    },
};