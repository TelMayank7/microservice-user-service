import { Types } from "mongoose";
import { IUSerDoc, User } from "shared-api";

class UserDao {
  async createUser(user: IUSerDoc): Promise<IUSerDoc> {
    const newUser = new User(user);
    return await newUser.save();
  }

  async loginUser(email: string, password: string): Promise<IUSerDoc | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async findUserById(id: Types.ObjectId): Promise<IUSerDoc | null> {
    return await User.findById(id);
  }

  async getAllUsers() : Promise<IUSerDoc[]> {
    return await User.find({});
  }
}

export default new UserDao();
