// models/Job.js (ESM)

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eligibility: {
      type: String,
      enum: ["MEDIBRIDGE_ONLY", "EXTERNAL_ONLY", "BOTH"],
      default: "BOTH",
    },
phone: { type: String, default: null },


    // NEW FIELD
    recruiterEmail: {
      type: String,
      required: true,
      default: null ,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
