import express from "express";
import { createGroup, getUserGroups, deleteGroup } from "../controllers/groupsController";

const router = express.Router();

router.post("/", createGroup);
router.get("/user/:userId", getUserGroups);
router.delete("/:groupId", deleteGroup);

export default router;
