import { Student } from "../models/student.js";

export const createStudent = async (req, res) => {
    try {

        const { userId, rollNumber, course, batch } = req.body;
        if (!userId || !rollNumber || !course || !batch) {
            return res.status(400).json({
                status: false,
                message: "All feilds are required"
            })
        }
        const existStudent = await Student.findOne({ rollNumber })
        if (existStudent) {
            return res.status(400).json({
                status: false,
                message: "Student already added"
            })
        }

        const student = await Student.create({
            userId, rollNumber, course, batch
        })
        await student.save()
        return res.status(201).json({
            status: true,
            message: "Student  added successfully"
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const students = await Student.find()
            .populate('userId', 'name email phone')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Student.countDocuments()
        res.json({
            students,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });

    }
}

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('userId');
        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        return res.status(200).json({
            message: "student fatched successfully",
            student
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}


export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
              const { userId, rollNumber, course, batch } = req.body;
        const student = await Student.findById(id)
        if(!student){
            return res.status(404).json({
                status:false,
                message:"Student not found"
            })
        }

         const students = await Student.findByIdAndUpdate(id,req.body,{new:true})

         return res.status(200).json({
            status:true,
            message:"Student updated successfully",
            students
         })
    } catch (error) {
       return res.status(400).json({
                status:false,
                message:error.message
            })
    }
}

export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignedStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'name email');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user.id
    }).populate("userId", "name email phone");

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student profile not found"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Student profile fetched successfully",
      data: student
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};