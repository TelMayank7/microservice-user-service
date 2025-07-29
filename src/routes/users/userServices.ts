import { Request, Response } from "express";
import userDao from "../../dao/user.dao";
import { User } from "shared-api";
import bcrypt from "bcrypt";
import generateToken from "../../configs/generateToken";
import { Types } from "mongoose";

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

      if (!createdUser) {
        return res.status(500).json({ message: "Failed to create user" });
      }

      const token = generateToken(
        createdUser._id.toString(),
        createdUser.email
      );

      return res.status(201).json({
        message: "User created successfully",
        data: createdUser,
        token: token,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await userDao.loginUser(email, password);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = generateToken(user._id.toString(), user.email);

      return res
        .status(200)
        .json({ message: "Login successful", data: user, token: token });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await userDao.findUserById(
        userId as unknown as Types.ObjectId
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User found", data: user });
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userDao.getAllUsers();

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      return res
        .status(200)
        .json({ message: "Users retrieved successfully", data: users });
    } catch (error) {
      console.error("Error fetching all users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const userData = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const updatedUser = await userDao.updateUser(
        userId as unknown as Types.ObjectId,
        userData
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
}

export default new UserServices();
