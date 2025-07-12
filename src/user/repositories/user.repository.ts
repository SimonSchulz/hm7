import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongodb";
import {User} from "../domain/user.entity";

export const usersRepository = {
  async create(user: User): Promise<string> {
    const newUser = await userCollection.insertOne({ ...user });
    return newUser.insertedId.toString();
  },
  async delete(id: string): Promise<boolean> {
    const isDel = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async findById(id: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    return userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },
  async checkExistByLoginOrEmail(
      login: string,
      email: string
  ): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [{ email }, { login }],
    });
    return !!user;
  },
  async findByConfirmationCode(code: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ "emailConfirmation.confirmationCode": code });
  },

  async confirmUser(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.modifiedCount === 1;
  },

  async updateConfirmation(
      id: string,
      code: string,
      expiration: string
  ): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            "emailConfirmation.confirmationCode": code,
            "emailConfirmation.expirationDate": expiration,
            "emailConfirmation.isConfirmed": false,
          },
        }
    );
    return result.modifiedCount === 1;
  },
};
