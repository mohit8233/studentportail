import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";

import {
  getStudentPerformance,
  getSubjectPerformance
} from "../controllers/performanceController.js";

const performanceRouter = express.Router();

performanceRouter.get(
  "/student/:studentId",
  authMiddle,
  getStudentPerformance
);

performanceRouter.get(
  "/subject/:studentId",
  authMiddle,
  getSubjectPerformance
);

export default performanceRouter;