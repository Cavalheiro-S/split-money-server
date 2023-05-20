import { Transaction } from "@prisma/client";
import { TransactionDTO } from "../dtos/TransactionDTO";
import { StatusCode } from "../enums/StatusCode";
import { ITransactionService } from "../interfaces/ITransactionService";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { getErrorResponse, getSuccessResponse } from "../utils/ApiResponse";
import Joi from "joi";
import { ValidationError } from "../exceptions/ValidationError";
import { TransactionCategoryEnum } from "../enums/TransactionCategoryEnum";
import { schemaId } from "../utils/ValidationSchema";
import { VALIDATION_MESSAGES } from "../consts/ValidationMessages";

export class TransactionService implements ITransactionService {

    private repository = new TransactionRepository()

    private validCategories = Object.values(TransactionCategoryEnum)

    private schemaTransaction = Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        description: Joi.string().allow(""),
        type: Joi.string().valid("income", "expense").required(),
        category: Joi.string().valid(...this.validCategories).insensitive().required(),
    })    

    validateTransaction(transaction: Object) {
        const { error } = this.schemaTransaction.validate(transaction)
        if (error) {
            error.message = error.message.replace(/"/g, "")
            throw new ValidationError(error.message)
        }
    }

    validateId(transactionId: string) {
        const { error } = schemaId.validate(transactionId)
        if (error) {
            error.message = error.message.replace(/"/g, "")
            throw new ValidationError(error.message)
        }
    }

    async getAll() {
        const transactions = await this.repository.getAll();
        return transactions.length === 0
            ? getSuccessResponse<Transaction>(StatusCode.OK, transactions, VALIDATION_MESSAGES.TransactionListEmpty)
            : getSuccessResponse<Transaction>(StatusCode.OK, transactions)
    }

    async getById(transactionId: string) {
        this.validateId(transactionId)
        const transaction = await this.repository.getById(parseInt(transactionId));
        return transaction
            ? getSuccessResponse<Transaction>(StatusCode.OK, transaction)
            : getErrorResponse(StatusCode.NOT_FOUND, [VALIDATION_MESSAGES.TransactionNotFound])
    }

    async create(transaction: Object) {
        this.validateTransaction(transaction)
        const transactionDTO = transaction as TransactionDTO
        const newTransaction = await this.repository.create(transactionDTO);
        return newTransaction
            ? getSuccessResponse<Transaction>(StatusCode.CREATED, newTransaction)
            : getErrorResponse(StatusCode.BAD_REQUEST, [VALIDATION_MESSAGES.TransactionCreateFailed])
    }

    async update(transactionId: string, transaction: TransactionDTO) {
        this.validateId(transactionId)
        this.validateTransaction(transaction)
        const transactionDTO = transaction as TransactionDTO
        const updatedTransaction = await this.repository.update(parseInt(transactionId), transactionDTO);
        return updatedTransaction
            ? getSuccessResponse<Transaction>(StatusCode.OK, updatedTransaction)
            : getErrorResponse(StatusCode.BAD_REQUEST, [VALIDATION_MESSAGES.TransactionUpdateFailed])
    }

    async delete(transactionId: string) {
        this.validateId(transactionId)
        const deletedTransaction = await this.repository.delete(parseInt(transactionId));
        return deletedTransaction
            ? getSuccessResponse<Transaction>(StatusCode.OK, deletedTransaction)
            : getErrorResponse(StatusCode.BAD_REQUEST, [VALIDATION_MESSAGES.TransactionDeleteFailed])
    }
}