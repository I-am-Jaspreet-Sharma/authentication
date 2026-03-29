import * as authServices from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js"

const register = async (req, res) => {
    const user = await authServices.register(req.body);
    ApiResponse.created(res, "Registration successful. Please verify your email.", user);
};

const verifyEmail = async (req, res) => {
    await authServices.verifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully");
};

const login = async (req, res) => {
    const {user, accessToken, refreshToken} = await authServices.login(req.body);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    ApiResponse.ok(res, "Login successful", {user, accessToken});
};

const refresh = async (req, res) => {
    const {accessToken} = await authServices.refresh(req.cookies.refreshToken);
    ApiResponse.ok(res, "Access Token refreshed", {accessToken});
}

const forgotPassword = async (req, res) => {
    await authServices.forgotPassword(req.body.email);
    ApiResponse.ok(res, "Reset password mail has been sent to provided email");
};

const newPassword = async (req, res) => {
    await authServices.newPassword(req.params.token, req.body.newPassword);
    ApiResponse.ok(res, "Password changed successfully");
};

const logout = async (req, res) => {
    await authServices.logout(req.user.id);
    res.clearCookie("refreshToken");
    ApiResponse.ok(res, "Logout successful");
};

const getMe = async (req, res) => {
    const user = await authServices.getMe(req.user.id)
    ApiResponse.ok(res, "User Profile", user);
}

export {register, verifyEmail, login, refresh, forgotPassword, newPassword, logout, getMe};