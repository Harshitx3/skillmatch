import { Router } from "express";
import { register, login, googleLogin, sendOTP, verifyOTP } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
