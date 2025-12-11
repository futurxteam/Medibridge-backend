import crypto from "crypto";
import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";
import User from "../models/User.js"
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// SEND OTP
// SEND OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  // 🚨 PREVENT OTP if user already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "This email is already registered. Please log in.",
    });
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save OTP in DB (valid for 5 minutes)
  await Otp.create({
    email,
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // Send Email
  await transporter.sendMail({
    from: `"Medibridge Portal" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  return res.json({ success: true, message: "OTP sent to email" });
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  const otpEntry = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!otpEntry) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (otpEntry.code !== code) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  if (otpEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  res.json({ success: true, message: "OTP verified" });
};
