import { Teacher } from "../models/teacher.js";


export const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    await teacher.populate("userId", "name email");

    return res.status(201).json({
      status: true,
      message: "Teacher created successfully",
      data: teacher
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("userId", "name email phone");

    return res.status(200).json({
      status: true,
      message: "Teachers fetched successfully",
      data: teachers
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    return res.status(200).json({
      status: true,
      message: "Teacher updated successfully",
      data: teacher
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Teacher deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};