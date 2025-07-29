import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userDao from "../dao/user.dao";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: any; // Define the user property to hold the authenticated user
}
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await userDao.findUserById(decoded.id as Types.ObjectId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
