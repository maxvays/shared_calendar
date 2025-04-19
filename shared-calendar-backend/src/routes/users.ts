import express from "express";
import { getAllUsers } from "../controllers/usersController";

const router = express.Router();

router.get("/", getAllUsers);

export default router;
