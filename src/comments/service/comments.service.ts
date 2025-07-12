import {Comment} from "../types/comment";
import {WithId} from "mongodb";
import { CommentInputDto} from "../dto/comment.input-dto";
import {commentsRepository} from "../repositories/comment.repo";
import {CommentatorInfo} from "../types/CommentatorInfo";
import {commentsQueryRepository} from "../repositories/comment.query.repo";
import {CommentQueryInput} from "../types/comment-query.input";

export const commentsService = {
    async findByIdOrFail(id: string): Promise<WithId<Comment> | null> {
        return commentsRepository.findByIdOrFail(id);
    },
    async findCommentsByPostId(
        postId: string,
        queryDto: CommentQueryInput,
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        return commentsQueryRepository.findCommentsByPostId(postId, queryDto);
    },
    async create( dto: CommentInputDto, info: CommentatorInfo, postId: string): Promise<WithId<Comment>> {
        console.log(info);
        const userInfo = {
           userId: info.userId,
            userLogin: info.userLogin,
        }
        let newComment: Comment= {
            content: dto.content,
            commentatorInfo: userInfo,
            createdAt: new Date().toISOString(),
            postId: postId
        };
        return commentsRepository.create(newComment);
    },
    async update(id: string, dto: CommentInputDto): Promise<void> {
        await commentsRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {
        await commentsRepository.delete(id);
        return;
    },
};