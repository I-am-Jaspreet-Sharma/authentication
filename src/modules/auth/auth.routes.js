import { Router } from "express";
import * as authControllers from "./auth.controller.js";
import validate from "../../common/middleware/validate.middleware.js"
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";
import ForgotPasswordDto from "./dto/forgot-password.dto.js";
import NewPasswordDto from "./dto/new-password.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), authControllers.register);
router.get("/verify/:token", authControllers.verifyEmail);
router.post("/login", validate(LoginDto), authControllers.login);
router.post("/refresh", authControllers.refresh);
router.post("/forgot-password", validate(ForgotPasswordDto), authControllers.forgotPassword);
router.put("/new-password/:token", validate(NewPasswordDto), authControllers.newPassword);
router.post("/logout", authenticate, authControllers.logout);
router.get("/me", authenticate, authControllers.getMe);

export default router;