import {ObjectId, WithId} from "mongodb";
import {Post} from "../types/post";
import {postCollection} from "../../db/mongodb";
import {PostInputDto} from "../dto/post.input-dto";
import {PostQueryInput} from "../types/post-query.input";

export const postsRepository = {
    async findMany(queryDto: PostQueryInput): Promise<{ items:WithId<Post>[], totalCount:number}> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const items = await postCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postCollection.countDocuments(filter);

        return { items, totalCount}
    },
    async findPostsByBlogId(blogId: string, queryDto: PostQueryInput): Promise<{ items: WithId<Post>[], totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        const filter = { blogId };

        const items = await postCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findByIdOrFail(id: string):  Promise<WithId<Post> | null>  {
        return postCollection.findOne({_id: new ObjectId(id)});
    },

    async create(newPost: Post): Promise<WithId<Post>> {
        const insertResult = await postCollection.insertOne(newPost);
        return { ...newPost, _id: insertResult.insertedId };
    },

    async update(id: string, dto: PostInputDto): Promise<void> {
        const updateResult = await postCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Post not exist');
        }
        return;
    },

    async delete(id: string): Promise <void> {
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Post not exist');
        }
        return;
    },
};