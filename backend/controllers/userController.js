import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
   try {
     const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            status: false,
            message: "Payload missing"
        })
    }
    const existing = await User.findOne({ email, phone });
    if (existing) {
        return res.status(400).json({
            status: false,
            message: 'User already exists'
        })
    };
    const hashed = await bcrypt.hash(password, 10);
    const user = await new User({ email, name, password: hashed, phone, role });

    await user.save()
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data:user
    });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}