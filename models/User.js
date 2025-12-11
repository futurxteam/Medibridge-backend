// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["STUDENT", "EXTERNAL", "FACULTY"],
      required: true,
    },
    // REMOVE THIS LINE:
    // isMedibridgeStudent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;