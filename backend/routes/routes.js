import { Router } from "express";
import {  login, register } from "../controllers/userController.js";


export const Routes = Router();

Routes.post("/register", register)
Routes.post("/login", login)

