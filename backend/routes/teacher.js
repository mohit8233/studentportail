import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";

import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher
} from "../controllers/teacherController.js";

const teacherRouter = express.Router();

teacherRouter.post("/", authMiddle, createTeacher);

teacherRouter.get("/", authMiddle, getAllTeachers);

teacherRouter.put("/:id", authMiddle, updateTeacher);

teacherRouter.delete("/:id", authMiddle, deleteTeacher);

export default teacherRouter;