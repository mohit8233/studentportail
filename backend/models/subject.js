import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    subjectName: {
      type: String,
      required: true
    },
    teacherName: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    statusColor: {
      type: String,
      enum: ["yellow", "green", "red", "blue", "gray"],
      default: "yellow"
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);