import { Marks } from "../models/marks.js";


export const addMarks = async (req, res) => {
  try {
    const { studentId, subject, marks, maxMarks, examName } = req.body;

    const teacherId = req.user.id;

    const mark = await Marks.create({
      studentId,
      subject,
      marks,
      maxMarks,
      examName,
      teacherId
    });

    return res.status(201).json({
      status: true,
      message: "Marks added successfully",
      data: mark
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getStudentMarks = async (req, res) => {
  try {
    const marks = await Marks.find({
      studentId: req.params.studentId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Marks fetched successfully",
      data: marks
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const updateMarks = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Marks updated successfully",
      data: marks
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const deleteMarks = async (req, res) => {
  try {
    await Marks.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Marks deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};