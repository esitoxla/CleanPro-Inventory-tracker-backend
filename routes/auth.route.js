import { Router } from "express";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { changePassword, getUser, login, logout, registerUser } from "../controllers/auth.controller.js";


const router = Router();

router.post("/register", registerUser);

router.post("/login", login);

router.post("/changePassword", protectRoutes, changePassword);

router.get("/me", protectRoutes, getUser);

router.post("/logout", logout);

export default router;