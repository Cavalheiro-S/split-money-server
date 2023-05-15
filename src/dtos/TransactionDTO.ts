import Joi from "joi";
import { TransactionCategoryEnum } from "../enums/TransactionCategoryEnum";
import { ValidationError } from "../exceptions/ValidationError";

export class TransactionDTO {
    id?: number;
    date: Date;
    amount: number;
    description?: string;
    type: string;
    category: string;

    private validCategories = Object.values(TransactionCategoryEnum)

    private schema = Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        description: Joi.string().allow(""),
        type: Joi.string().valid("income", "expense").required(),
        category: Joi.string().valid(...this.validCategories).insensitive().required(),
    })

    constructor(date: string, amount: number, description: string, type: string, category: string) {
        this.validate({ date, amount, description, type, category })
        this.date = new Date(date);
        this.amount = amount;
        this.description = description;
        this.type = type;
        this.category = category;
    }

    private validate(transaction: Object) {
        const { error } = this.schema.validate(transaction)

        if (error){
            error.message = error.message.replace(/"/g, "")
            throw new ValidationError(error.message)
        }
    }
}