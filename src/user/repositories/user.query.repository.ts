import { UserViewModel } from "../dto/user.view-model";
import { userCollection } from "../../db/mongodb";
import { UserQueryInput } from "../types/user-query.input";
import { ObjectId, WithId } from "mongodb";
import { User } from "../types/user";
import { PaginatedOutput } from "../../core/types/paginated.output";

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
      items: users.map((u: WithId<User>) => this._getInView(u)),
    };
  },
  async findById(id: string): Promise<UserViewModel | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return user ? this._getInView(user) : null;
  },
  _getInView(user: WithId<User>): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
  _checkObjectId(id: string): boolean {
    return ObjectId.isValid(id);
  },
};
