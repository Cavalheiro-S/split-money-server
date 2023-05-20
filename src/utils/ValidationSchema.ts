import Joi from "joi";
import { VALIDATION_MESSAGES } from "../consts/ValidationMessages";

export const schemaId = Joi.number().required().messages({
    "string.base": VALIDATION_MESSAGES.InvalidTransactionId,
    "number.base": VALIDATION_MESSAGES.InvalidTransactionId
})