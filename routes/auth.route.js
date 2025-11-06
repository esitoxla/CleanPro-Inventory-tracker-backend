import { Router } from "express";
import { protectRoutes } from "../middleware/protectRoutes.js";
import { changePassword, getUser, login, logout } from "../controllers/auth.controller.js";


const router = Router();

router.post("/login", login);

router.post("/changePassword", changePassword);

router.get("/me", getUser);

router.post("/logout", logout);

export default router;