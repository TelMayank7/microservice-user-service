import { Request, Response } from "express";
import userDao from "../../dao/user.dao";
import { User } from "shared-api";
import bcrypt from "bcrypt";

class UserServices {
  async createUser(req: Request, res: Response) {
    try {
      const user = req.body;

      const checkUser = await User.findOne({ email: user.email });
      if (checkUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashPassword = await bcrypt.hash(user.password, 10);

      user.password = hashPassword;

      const createdUser = await userDao.createUser(user);
      return res.status(201).json({
        message: "User created successfully",
        data: createdUser,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
}

export default new UserServices();
