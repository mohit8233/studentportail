import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";

import {
  markAttendance,
  getStudentAttendance
} from "../controllers/attendanceController.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/", authMiddle, markAttendance);

attendanceRouter.get(
  "/student/:studentId",
  authMiddle,
  getStudentAttendance
);

export default attendanceRouter;