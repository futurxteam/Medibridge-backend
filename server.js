// server.js (ESM version)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Role-specific routes
app.use("/api/student", studentRoutes);  // /api/student/jobs
app.use("/api/faculty", facultyRoutes);  // /api/faculty/jobs
app.use("/api/otp", otpRoutes);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
