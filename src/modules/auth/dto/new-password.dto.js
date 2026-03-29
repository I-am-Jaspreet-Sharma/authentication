import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class NewPasswordDto extends BaseDto {
    static schema = Joi.object({
        newPassword: Joi.string().min(8).pattern(/(?=.*[A-Z])(?=.*\d)/).required().messages({
            "string.pattern.base": "Password must contain at least one uppercase letter and one digit",
            "string.min": "Password must be at least 8 characters long",
            "any.required": "New password is required"
        }),
    });
}

export default NewPasswordDto;