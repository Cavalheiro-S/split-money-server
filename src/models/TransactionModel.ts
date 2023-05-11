import Joi from "joi";
import { TransactionCategoryEnum } from "../enums/TransactionCategoryEnum";
import { ValidationError } from "../exceptions/ValidationError";

class TransactionModel {
    id?: number;
    date: Date;
    amount: number;
    description: string;
    type: string;
    category: TransactionCategoryEnum;
    // userId: number;

    constructor(transaction: TransactionDTO) {
        const validCategories = Object.values(TransactionCategoryEnum)
        const schema = Joi.object({
            date: Joi.date().required(),
            amount: Joi.number().required(),
            description: Joi.string().allow(""),
            type: Joi.string().valid("income", "expense").required(),
            category: Joi.string().valid(...validCategories).insensitive().required(),
        })

        const { error } = schema.validate(transaction)

        if (error) throw new ValidationError(error.message)

        this.date = new Date(transaction.date);
        this.amount = transaction.amount;
        this.description = transaction.description ?? "";
        this.type = transaction.type;
        this.category = transaction.category as TransactionCategoryEnum;
        // this.userId = userId;
    }

}

export { TransactionModel };
