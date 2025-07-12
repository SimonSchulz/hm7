import { UserViewModel } from "../dto/user.view-model";
import { userCollection } from "../../db/mongodb";
import { UserQueryInput } from "../types/user-query.input";
import { ObjectId, WithId } from "mongodb";
import { PaginatedOutput } from "../../core/types/paginated.output";
import {User} from "../domain/user.entity";
import {mapToUserViewModel} from "../routers/mappers/map-to-user-view-model";

export const usersQueryRepository = {
  async findAllUsers(sortQueryDto: UserQueryInput): Promise<PaginatedOutput> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      searchLoginTerm,
      searchEmailTerm,
    } = sortQueryDto;

    const filter: any = {};
    if (searchLoginTerm && searchEmailTerm) {
      filter.$or = [
        { login: { $regex: searchLoginTerm, $options: "i" } },
        { email: { $regex: searchEmailTerm, $options: "i" } },
      ];
    } else if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: "i" };
    } else if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: "i" };
    }

    const totalCount = await userCollection.countDocuments(filter);

    const users = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: users.map((u: WithId<User>) => mapToUserViewModel(u)),
    };
  },
  async findById(id: string): Promise<UserViewModel | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return user ? mapToUserViewModel(user) : null;
  },

};
