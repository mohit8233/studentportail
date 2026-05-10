import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import { fileURLToPath } from "url";

import { connectDb } from "./config/db.js";


import studentRouter from "./routes/students.js";
import { Routes } from "./routes/routes.js";
import teacherRouter from "./routes/teacher.js";
import courseRouter from "./routes/course.js";
import attendanceRouter from "./routes/attendance.js";
import marksRouter from "./routes/marks.js";
import assignmentRouter from "./routes/assignments.js";
import performanceRouter from "./routes/performance.js";
import userRouter from "./routes/user.js";
import subjectRouter from "./routes/subjectRoutes.js";
import topicRouter from "./routes/topic.js";


dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());

app.use(cors());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// database
connectDb();

// routes
app.use("/api/auth", Routes);

app.use("/api/students", studentRouter);

app.use("/api/teachers", teacherRouter);

app.use("/api/courses", courseRouter);

app.use("/api/attendance", attendanceRouter);

app.use("/api/marks", marksRouter);

app.use("/api/assignments", assignmentRouter);

app.use("/api/performance", performanceRouter);

app.use("/api/users", userRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/topics", topicRouter);
app.get("/", (req, res) => {
  res.send("Student Management System API Running");
});

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});