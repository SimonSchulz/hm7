import {WithId} from "mongodb";
import {User} from "../../domain/user.entity";
import {UserViewModel} from "../../dto/user.view-model";

export function mapToUserViewModel(user: WithId<User>): UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
}