import express, { RequestHandler } from "express";
import userServices from "./userServices";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/create", userServices.createUser as RequestHandler);
router.post("/login", userServices.loginUser as RequestHandler);
router.get("/:id", userServices.findUserById as RequestHandler);
router.get("/", userServices.getAllUsers as RequestHandler);
router.patch("/:id", authMiddleware , userServices.updateUser as RequestHandler);


export { router };