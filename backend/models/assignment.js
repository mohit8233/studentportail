import mongoose from "mongoose";

const assignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: { type: String },
    file: { type: String },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'graded'],
        default: 'pending'
    },
    submittedFile: { type: String },
    submittedAt: { type: Date },
    marksAwarded: {
        type: Number,
        min: 0, max: 100
    },
    feedback: { type: String }
}, { timestamps: true })


export const Assign = mongoose.model("Assign", assignSchema)