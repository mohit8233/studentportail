import { Attendance } from "../models/attendance.js";
import { Student } from "../models/student.js";



export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const existingAttendance = await Attendance.findOne({
      studentId,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({
        status: false,
        message: "Attendance already marked for this date"
      });
    }

    const attendance = await Attendance.create({
      studentId,
      date,
      status
    });

    const totalAttendance = await Attendance.countDocuments({
      studentId
    });

    const presentAttendance = await Attendance.countDocuments({
      studentId,
      status: "present"
    });

    const attendancePercentage =
      (presentAttendance / totalAttendance) * 100;

    await Student.findByIdAndUpdate(studentId, {
      attendance: attendancePercentage
    });

    return res.status(201).json({
      status: true,
      message: "Attendance marked successfully",
      data: attendance
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      studentId: req.params.studentId
    }).sort("-date");

    return res.status(200).json({
      status: true,
      message: "Attendance fetched successfully",
      data: attendance
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};