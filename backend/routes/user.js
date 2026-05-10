import express from "express";

import { User } from "../models/userModel.js";
import { authMiddle } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", authMiddle, async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-password");

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
});

export default userRouter;