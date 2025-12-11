import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const router = Router();

router.post("/send", sendOtp);      // POST /api/otp/send
router.post("/verify", verifyOtp);  // POST /api/otp/verify

export default router;
