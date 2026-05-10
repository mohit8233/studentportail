import multer from "multer";
import path from "path";


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }

});


const fileFilter = (req, file, cb) => {

    const allowedFile = /jpeg|jpg|png|pdf|doc|docx/;

    const extname = path.extname(file.originalname).toLowerCase();

    if (allowedFile.test(extname)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and documents allowed"), false);
    }

};


export const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});