import { Router } from "express";
import auth from "../middleware/auth.js";
import { getUsers, getUserById, updateProfile } from "../controllers/userController.js";

const router = Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/profile", auth, updateProfile);

export default router;
