import AcademyStudent from "../models/AcademyStudent.js";

// CREATE
export const createStudent = async (req, res) => {
  try {
    const student = await AcademyStudent.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
export const getStudents = async (req, res) => {
  try {
    const students = await AcademyStudent.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
export const getStudentById = async (req, res) => {
  try {
    const student = await AcademyStudent.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateStudent = async (req, res) => {
  try {
    const updated = await AcademyStudent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteStudent = async (req, res) => {
  try {
    const deleted = await AcademyStudent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
