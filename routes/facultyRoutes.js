// routes/facultyRoutes.js
import { Router } from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobsForFaculty,
  updateJob,
  deleteJob,
  getApplicationsForJob,
  bulkCreateJobs
} from "../controllers/jobController.js";
import {
  addReferralCodes,
  getReferralCodes,
  deleteReferralCode,
  toggleReferralStatus
} from "../controllers/referralController.js";


const router = Router();

// ── JOB CRUD ──
router.post("/jobs", auth, requireRole("FACULTY"), createJob);
router.get("/jobs", auth, requireRole("FACULTY"), getJobsForFaculty);
router.put("/jobs/:id", auth, requireRole("FACULTY"), updateJob);
router.delete("/jobs/:id", auth, requireRole("FACULTY"), deleteJob);

// ── APPLICATION MANAGEMENT ──
router.get("/jobs/:id/applications", auth, requireRole("FACULTY"), getApplicationsForJob);
// All referral actions are faculty-only
router.post("/referral/add", auth, requireRole("FACULTY"), addReferralCodes);
router.get("/referral/all", auth, requireRole("FACULTY"), getReferralCodes);
router.delete("/referral/:code", auth, requireRole("FACULTY"), deleteReferralCode);
router.patch("/refferal/:code/toggle", auth, requireRole("FACULTY"), toggleReferralStatus);
router.post(
  "/jobs/bulk",
  auth,
  requireRole("FACULTY"),
  bulkCreateJobs
);



export default router;













