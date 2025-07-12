import {WithId} from "mongodb";
import {PaginatedOutput} from "../../core/types/paginated.output";
import {CommentQueryInput} from "../types/comment-query.input";
import {mapToCommentViewModel} from "./map-to-comment-view-model";
import {Comment} from "../types/comment";

export function mapToCommentListModel(comments: WithId<Comment>[], totalCount: number, query: CommentQueryInput) :
    PaginatedOutput{
    const {
        pageNumber: page,
        pageSize,
    } = query;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
        pagesCount,
        page,
        pageSize,
        totalCount,
        items: comments.map(mapToCommentViewModel),
    };
}