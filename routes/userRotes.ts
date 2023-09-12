import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/refreshToken", userController.refreshToken);

export default router;
