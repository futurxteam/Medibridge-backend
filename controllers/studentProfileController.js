import StudentProfile from "../models/StudentProfile.js";
import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config();
// Cloudinary Config (loads directly from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",   // force PDF handling
    folder: "cv_uploads",
    type: "upload",
    use_filename: true,
    unique_filename: false,
  });
};

// =========================
// GET PROFILE
// =========================
export const getProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user.id });
  res.json(profile || {});
};

// =========================
// UPDATE PROFILE (with CV upload)
// =========================

export const updateProfile = async (req, res) => {
  try {
    let fields = req.body;

    // 🔥 Ensure _id is never passed into update
    if (fields._id) delete fields._id;

    // 🔥 Handle CV upload if file is included
   if (req.file) {
  const upload = await uploadToCloudinary(req.file.path);
  fields.cvUrl = upload.secure_url;
  fields.cvPublicId = upload.public_id;
}


    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { ...fields, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// =========================
// CHECK PROFILE COMPLETION
// =========================
export const checkProfileCompletion = async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user.id });

  if (!profile) return res.json({ complete: false });

  const requiredFields = [
    "phone",
    "address",
    "age",
    "sex",
    "qualification",
    "university",
    "cvUrl",
  ];

  const complete = requiredFields.every((f) => profile[f]);

  res.json({ complete });
};


