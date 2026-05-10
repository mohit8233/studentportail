import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    experience:{
         type:String,
         default:0
    }
},{timestamps:true})

export const Teacher = mongoose.model("Teacher", teacherSchema)