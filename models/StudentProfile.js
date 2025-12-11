import mongoose from "mongoose";

const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

  phone: { type: String, required: false },
  address: { type: String, required: false },
  age: { type: Number, required: false },
  sex: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: false },

  qualification: { type: String, required: false },
  university: { type: String, required: false },

  cvUrl: { type: String, required: false }, // uploaded file

  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("StudentProfile", StudentProfileSchema);
