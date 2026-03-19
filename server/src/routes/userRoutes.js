import { Router } from "express";
import auth from "../middleware/auth.js";
import { getUsers, getUserById, updateProfile, getMe, checkUsername } from "../controllers/userController.js";

const router = Router();

router.get("/me", auth, getMe);
router.get("/check-username", auth, checkUsername);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/profile", auth, updateProfile);

export default router;
