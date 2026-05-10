import { Subject } from "../models/subject.js";

export const createSubject = async (req, res) => {
  try {
    const { courseId, subjectName } = req.body;

    if (!courseId || !subjectName) {
      return res.status(400).json({
        status: false,
        message: "CourseId and subjectName are required"
      });
    }

    const subject = await Subject.create(req.body);

    return res.status(201).json({
      status: true,
      message: "Subject created successfully",
      data: subject
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getSubjectsByCourse = async (req, res) => {
  try {
    const subjects = await Subject.find({
      courseId: req.params.courseId
    }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      status: true,
      message: "Subjects fetched successfully",
      data: subjects
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Subject updated successfully",
      data: subject
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Subject deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};