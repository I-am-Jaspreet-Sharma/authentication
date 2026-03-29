import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const authenticate = async (req, _, next) => {
    let token;
    if(req.headers.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token) throw ApiError.unauthorized("Not Authenticated");
    const decoded = verifyAccessToken(token);
    if(!decoded) throw ApiError.unauthorized("Invalid Access Token");
    const user = await User.findById(decoded.id);
    if(!user) throw ApiError.notFound("User not found");
    req.user = {id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified};
    next();
}

const authorize = (...roles) => {
    return (req, _, next) => {
        if(!roles.includes(req.user.role)) throw ApiError.forbidden("You do not have permission to perform this action");
        next();
    };
};

export {authenticate, authorize};