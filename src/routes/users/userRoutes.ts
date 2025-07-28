import express from "express";
import userServices from "./userServices";

const router = express.Router();

router.post("/create", userServices.createUser);


export { router };