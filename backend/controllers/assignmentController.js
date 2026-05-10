
import { Assign } from "../models/assignment.js";
import { Student } from "../models/student.js";


export const createAssignment = async (req, res) => {
  try {
    const { title, description, studentId } = req.body;

    const teacherId = req.user.id;
    const file = req.file ? req.file.filename : null;

    const assignment = await Assign.create({
      title,
      description,
      file,
      teacherId,
      studentId
    });

    return res.status(201).json({
      status: true,
      message: "Assignment created successfully",
      data: assignment
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assign.find({
      teacherId: req.user.id
    }).populate("studentId", "rollNumber");

    return res.status(200).json({
      status: true,
      message: "Teacher assignments fetched successfully",
      data: assignments
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user.id
    });

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student profile not found"
      });
    }

    const assignments = await Assign.find({
      studentId: student._id
    });

    return res.status(200).json({
      status: true,
      message: "Student assignments fetched successfully",
      data: assignments
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assign.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        status: false,
        message: "Assignment not found"
      });
    }

    const file = req.file ? req.file.filename : null;

    assignment.submittedFile = file;
    assignment.status = "submitted";
    assignment.submittedAt = new Date();

    await assignment.save();

    return res.status(200).json({
      status: true,
      message: "Assignment submitted successfully",
      data: assignment
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const gradeAssignment = async (req, res) => {
  try {
    const { marksAwarded, feedback } = req.body;

    const assignment = await Assign.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        status: false,
        message: "Assignment not found"
      });
    }

    assignment.marksAwarded = marksAwarded;
    assignment.feedback = feedback;
    assignment.status = "graded";

    await assignment.save();

    return res.status(200).json({
      status: true,
      message: "Assignment graded successfully",
      data: assignment
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};