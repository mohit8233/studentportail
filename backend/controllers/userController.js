import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        if (!name || !email || !password) {
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
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: " Invalid email Register first "
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );


        return res.status(200).json({
            status: true,
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};