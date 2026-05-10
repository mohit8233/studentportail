import mongoose from "mongoose";

import { Marks } from "../models/marks.js";
import { Assign } from "../models/assignment.js";
import { Student } from "../models/student.js";

export const getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId).populate("userId", "name");

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found"
      });
    }

    const marksData = await Marks.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(student._id)
        }
      },
      {
        $group: {
          _id: null,
          totalObtained: { $sum: "$marks" },
          totalMax: { $sum: "$maxMarks" },
          averagePercent: {
            $avg: {
              $multiply: [
                { $divide: ["$marks", "$maxMarks"] },
                100
              ]
            }
          },
          subjectWise: {
            $push: {
              subject: "$subject",
              marks: "$marks",
              maxMarks: "$maxMarks",
              examName: "$examName"
            }
          }
        }
      }
    ]);

    const marksSummary = marksData[0] || {
      totalObtained: 0,
      totalMax: 0,
      averagePercent: 0,
      subjectWise: []
    };

    const assignments = await Assign.find({
      studentId: student._id
    });

    const totalAssignments = assignments.length;

    const submittedAssignments = assignments.filter(
      (assignment) => assignment.status !== "pending"
    ).length;

    const gradedAssignments = assignments.filter(
      (assignment) => assignment.status === "graded"
    ).length;

    const completionRate = totalAssignments
      ? (submittedAssignments / totalAssignments) * 100
      : 0;

    const avgAssignmentMarks =
      assignments
        .filter(
          (assignment) =>
            assignment.marksAwarded !== undefined &&
            assignment.marksAwarded !== null
        )
        .reduce((sum, assignment) => sum + assignment.marksAwarded, 0) /
      (gradedAssignments || 1);

    return res.status(200).json({
      status: true,
      message: "Student performance fetched successfully",
      data: {
        student: {
          id: student._id,
          name: student.userId?.name,
          rollNumber: student.rollNumber,
          course: student.course,
          batch: student.batch
        },
        marks: {
          totalObtained: marksSummary.totalObtained,
          totalMax: marksSummary.totalMax,
          overallPercentage: marksSummary.totalMax
            ? ((marksSummary.totalObtained / marksSummary.totalMax) * 100).toFixed(2)
            : 0,
          averagePercentage: Number(marksSummary.averagePercent).toFixed(2),
          subjectWise: marksSummary.subjectWise
        },
        assignments: {
          total: totalAssignments,
          submitted: submittedAssignments,
          graded: gradedAssignments,
          completionRate: completionRate.toFixed(2),
          averageMarksAwarded: avgAssignmentMarks.toFixed(2),
          list: assignments
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getSubjectPerformance = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const subjectStats = await Marks.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: "$subject",
          totalObtained: { $sum: "$marks" },
          totalMax: { $sum: "$maxMarks" },
          testsCount: { $sum: 1 },
          averagePercent: {
            $avg: {
              $multiply: [
                { $divide: ["$marks", "$maxMarks"] },
                100
              ]
            }
          }
        }
      }
    ]);

    return res.status(200).json({
      status: true,
      message: "Subject performance fetched successfully",
      data: subjectStats
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};