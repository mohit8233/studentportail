import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";

import {
  createStudent,
  getAllStudents,
  getAssignedStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getMyStudentProfile
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/", authMiddle, createStudent);

studentRouter.get("/", authMiddle, getAllStudents);

studentRouter.get("/assigned", authMiddle, getAssignedStudents);

/* IMPORTANT */
studentRouter.get("/me", authMiddle, getMyStudentProfile);

studentRouter.get("/:id", authMiddle, getStudentById);

studentRouter.put("/:id", authMiddle, updateStudent);

studentRouter.delete("/:id", authMiddle, deleteStudent);

export default studentRouter;