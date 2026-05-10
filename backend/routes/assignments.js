import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";


import {
  createAssignment,
  getTeacherAssignments,
  getStudentAssignments,
  submitAssignment,
  gradeAssignment
} from "../controllers/assignmentController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const assignmentRouter = express.Router();

assignmentRouter.post(
  "/",
  authMiddle,
  upload.single("file"),
  createAssignment
);

assignmentRouter.get(
  "/teacher",
  authMiddle,
  getTeacherAssignments
);

assignmentRouter.get(
  "/student",
  authMiddle,
  getStudentAssignments
);

assignmentRouter.post(
  "/submit/:id",
  authMiddle,
  upload.single("file"),
  submitAssignment
);

assignmentRouter.put(
  "/grade/:id",
  authMiddle,
  gradeAssignment
);

export default assignmentRouter;