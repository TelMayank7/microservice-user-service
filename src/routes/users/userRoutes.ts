import express from "express";
import userServices from "./userServices";

const router = express.Router();

router.post("/create", userServices.createUser);
router.post("/login", userServices.loginUser);
router.get("/:id", userServices.findUserById);
router.get("/", userServices.getAllUsers);


export { router };