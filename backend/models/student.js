import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true

    },
    course: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true,
    },
    attendance: {
        type: Number,
        default: 0

    },
     totalClasses: {
        type: Number,
        default: 0
    },
      presentClasses: {
        type: Number,
        default: 0
    }
},{timestamps:true})

export const Student = mongoose.model("Student", studentSchema) 