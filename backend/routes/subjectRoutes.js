import express from "express";
import {
  createSubject,
  deleteSubject,
  getSubjectsByCourse,
  updateSubject
} from "../controllers/subjectController.js";

const subjectRouter = express.Router();

subjectRouter.post("/create", createSubject);
subjectRouter.get("/course/:courseId", getSubjectsByCourse);
subjectRouter.patch("/update/:id", updateSubject);
subjectRouter.delete("/delete/:id", deleteSubject);

export default subjectRouter;