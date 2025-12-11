// routes/authRoutes.js
import { Router } from "express";
import { register, login, getProfile,forgotPasswordSendOtp,forgotPasswordVerifyOtp,resetPassword } from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.post("/forgot-password", forgotPasswordSendOtp);
router.post("/forgot-password/verify", forgotPasswordVerifyOtp);
router.post("/reset-password", resetPassword);

export default router;