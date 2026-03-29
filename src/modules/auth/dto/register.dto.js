import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().pattern(/(?=.*[A-Z])(?=.*\d)/).min(8).required().messages({
            "string.pattern.base": "Password must contain at least one uppercase letter and one digit",
            "string.min": "Password must be at least 8 characters long",
            "any.required": "Password is required"
        }),
        role: Joi.string().valid("customer", "seller").default("customer"),
    });
}

export default RegisterDto;