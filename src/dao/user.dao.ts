import { IUSerDoc, User } from "shared-api";

class UserDao {
    async createUser(user : IUSerDoc): Promise<IUSerDoc> {
        const newUser = new User(user);
        return await newUser.save();
    }
}

export default new UserDao();