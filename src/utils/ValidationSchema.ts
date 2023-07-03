import z from "zod";
import { VALIDATION_MESSAGES } from "../consts/ValidationMessages";

export const schemaId = z.coerce.number({
    required_error: VALIDATION_MESSAGES.InvalidTransactionId,
    invalid_type_error: VALIDATION_MESSAGES.InvalidTransactionId
})