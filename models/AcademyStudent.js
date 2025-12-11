import mongoose from "mongoose";

const AcademyStudentSchema = new mongoose.Schema({
  admissionNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model("AcademyStudent", AcademyStudentSchema);
