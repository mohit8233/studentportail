import { Course } from "../models/course.js";


export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    return res.status(201).json({
      status: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      status: true,
      message: "Courses fetched successfully",
      data: courses
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};