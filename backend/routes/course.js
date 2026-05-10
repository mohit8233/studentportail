import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";

import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.post("/", authMiddle, createCourse);

courseRouter.get("/", authMiddle, getAllCourses);

courseRouter.put("/:id", authMiddle, updateCourse);

courseRouter.delete("/:id", authMiddle, deleteCourse);

export default courseRouter;