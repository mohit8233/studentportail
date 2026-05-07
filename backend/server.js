import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import { fileURLToPath } from "url";

import { connectDb } from "./config/db.js";
import { Routes } from "./routes/routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// middleware
app.use(express.json());

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// database
connectDb();


// routes
app.use("/api/auth", Routes);


// server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});