import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
          required:true
    },
    duration:{
        type:String,
          required:true
    },
    fees:{
        type:Number,
          required:true
    }
},{ timestamps: true })

export const Course = mongoose.model("Course",courseSchema)