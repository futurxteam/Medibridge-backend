// routes/studentRoutes.js
import { Router } from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

import { auth, requireRole } from "../middleware/authMiddleware.js";

import {
  getJobsForStudentOrExternal,
  applyToJob,
} from "../controllers/jobController.js";

import {
  getProfile,
  updateProfile,
  checkProfileCompletion,
  
} from "../controllers/studentProfileController.js";

const router = Router();


/* ============================================
   JOB ROUTES
============================================ */

// GET all jobs for student/external
router.get(
  "/jobs",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  getJobsForStudentOrExternal
);

// APPLY to job
router.post(
  "/apply/:jobId",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  applyToJob
);

/* ============================================
   PROFILE ROUTES
============================================ */

// Get profile
router.get(
  "/profile",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  getProfile
);

// Update profile with CV upload
router.put(
  "/profile",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  upload.single("cv"),   // This enables Cloudinary CV upload
  updateProfile
);

// Check completion (optional)
router.get(
  "/profile/check",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  checkProfileCompletion
);

export default router;
