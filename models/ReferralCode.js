// models/ReferralCode.js
import mongoose from "mongoose";

const ReferralCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  valid: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("ReferralCode", ReferralCodeSchema);
