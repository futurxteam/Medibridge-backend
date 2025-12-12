import express from "express";
import { getJobsPublic } from "../controllers/jobController.js";

const router = express.Router();

// PUBLIC: Get External + Both Jobs (with optional title search)
router.get("/all", getJobsPublic);

export default router;
