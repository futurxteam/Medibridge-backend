import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ReferralCode from "../models/ReferralCode.js";

import Otp from "../models/Otp.js"; 
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    /* ================================
   REFERRAL CODE VALIDATION
   AUTO-ASSIGN STUDENT ROLE
================================ */
let finalRole = "EXTERNAL"; // always default

if (referralCode) {
  const referralRecord = await ReferralCode.findOne({ code: referralCode });

  if (!referralRecord || !referralRecord.valid) {
    return res.status(400).json({
      message: "Invalid referral code.",
    });
  }

  finalRole = "STUDENT";

  // Optional: make code single-use
  // referralRecord.valid = false;
  // await referralRecord.save();
}


    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role: finalRole,
      referralCode: referralCode || null,
    });

    const token = createToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/profile (protected route)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMedibridgeStudentByFaculty = async (req, res) => {
  try {
    // Only FACULTY can use this
    if (req.user.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create Medibridge students" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const student = await User.create({
      name,
      email,
      password: passwordHash,
      role: "STUDENT", // Forced to STUDENT
    });

    res.status(201).json({
      message: "Medibridge student created successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
    });
  } catch (err) {
    console.error("Faculty create student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// SEND PASSWORD RESET OTP
export const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required." });

    // Ensure user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to DB
    await Otp.create({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send Email
    await transporter.sendMail({
      from: `"Medibridge Portal" <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, message: "Password reset OTP sent" });

  } catch (err) {
    console.error("Forgot Password OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "Email and OTP required" });

    const otpEntry = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpEntry)
      return res.status(400).json({ message: "OTP not found" });

    if (otpEntry.code !== code)
      return res.status(400).json({ message: "Incorrect OTP" });

    if (otpEntry.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    res.json({ success: true, message: "OTP verified" });

  } catch (err) {
    console.error("Forgot Password Verify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const hash = await bcrypt.hash(newPassword, 10);

    user.password = hash;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully. Please log in.",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
