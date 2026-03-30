import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import {generateAccessToken, generateRefreshToken, generateToken, hashToken, verifyRefreshToken} from "../../common/utils/jwt.utils.js";
import {sendResetPasswordMail, sendVerificationMail} from "../../common/config/email.js";

const register = async ({name, email, password, role}) => {
    const existing = await User.findOne({email});
    if(existing) throw ApiError.conflict("Email already exists");
    const token = generateToken();
    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashToken(token),
    });
    try {
        await sendVerificationMail(email, token);
    } catch (err) {
        console.error("Failed to send verification email:", err.message);
    }
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verficationToken;
    return userObj;
};

const verifyEmail = async (token) => {
    if(!token) throw ApiError.badRequest("Invalid Token");
    const hashedToken = hashToken(token);
    const user = await User.findOne({verificationToken: hashedToken}).select("+verficationToken");
    if(!user) throw ApiError.notFound("User not found");
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({validateBeforeSave: false});
};

const login = async ({email, password}) => {
    const user = await User.findOne({email}).select("+password");
    if(!user) throw ApiError.notFound("Invalid email or password");
    if(!user.isVerified) throw ApiError.forbidden("Email is not verified, Please verify your email");
    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw ApiError.unauthorized("Invalid email or password");
    const accessToken = generateAccessToken({id: user._id});
    const refreshToken = generateRefreshToken({id: user._id});
    const hashedRefreshToken = hashToken(refreshToken);
    user.refreshToken = hashedRefreshToken;
    await user.save({validateBeforeSave: false});
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return {user: userObj, accessToken, refreshToken};
};

const refresh = async (token) => {
    if(!token) throw ApiError.unauthorized("Refresh Token missing");
    const decoded = verifyRefreshToken(token);
    if(!decoded) throw ApiError.unauthorized("Invalid Refresh Token");
    const user = await User.findById(decoded.id).select("+refreshToken");
    if(!user) throw ApiError.notFound("User not found");
    if(!user.isVerified) throw ApiError.forbidden("User not verified");
    if(user.refreshToken !== hashToken(token)) throw ApiError.unauthorized("Invalid refresh token");
    const accessToken = generateAccessToken({id: user._id});
    return {accessToken};
};

const forgotPassword = async (email) => {
    const user = await User.findOne({email});
    if(!user) throw ApiError.notFound("No such email exists");
    if(!user.isVerified) throw ApiError.forbidden("Email is not verified");
    const token = generateToken();
    try {
        await sendResetPasswordMail(email, token);
    } catch (err) {
        console.error("Failed to send reset email:", err.message); 
    }
    const hashedToken = hashToken(token);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({validateBeforeSave: false});
};

const newPassword = async (token, newPassword) => {
    if(!token) throw ApiError.badRequest("Invalid Token");
    const hashedToken = hashToken(token);
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");
    if(!user) throw ApiError.notFound("User not found");
    if(!user.isVerified) throw ApiError.forbidden("User not verified");
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
};

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, {refreshToken: null});
};

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if(!user) throw ApiError.notFound("User not found");
    if(!user.isVerified) throw ApiError.forbidden("User not verified");
    return user;
}

export {register, verifyEmail, login, refresh, forgotPassword, newPassword, logout, getMe};
