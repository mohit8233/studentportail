import express from "express";

import { authMiddle } from "../middleware/authMiddleware.js";

import {
  addMarks,
  getStudentMarks,
  updateMarks,
  deleteMarks
} from "../controllers/marksController.js";

const marksRouter = express.Router();

marksRouter.post("/", authMiddle, addMarks);

marksRouter.get(
  "/student/:studentId",
  authMiddle,
  getStudentMarks
);

marksRouter.put("/:id", authMiddle, updateMarks);

marksRouter.delete("/:id", authMiddle, deleteMarks);

export default marksRouter;