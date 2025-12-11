// models/Application.js

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Keep unique index so no double apply
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;