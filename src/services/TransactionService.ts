import { Transaction } from "@prisma/client";
import { TransactionDTO } from "../dtos/TransactionDTO";
import { StatusCode } from "../enums/StatusCode";
import { ITransactionService } from "../interfaces/ITransactionService";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { getErrorResponse, getSuccessResponse } from "../utils/ApiResponse";
import Joi from "joi";
import { ValidationError } from "../exceptions/ValidationError";
import { TransactionCategoryEnum } from "../enums/TransactionCategoryEnum";

export class TransactionService implements ITransactionService {

    private repository = new TransactionRepository()

    private validateMessages = {
        "TransactionListEmpty": "No transactions found",
        "TransactionNotFound": "Transaction not found",
        "TransactionCreateFailed": "Failed to create transaction",
        "TransactionUpdateFailed": "Failed to update transaction",
        "TransactionDeleteFailed": "Failed to delete transaction",
        "InvalidTransactionId": "Invalid transaction id"
    }

    private validCategories = Object.values(TransactionCategoryEnum)

    private schemaTransaction = Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        description: Joi.string().allow(""),
        type: Joi.string().valid("income", "expense").required(),
        category: Joi.string().valid(...this.validCategories).insensitive().required(),
    })

    private schemaId = Joi.number().required().messages({
        "string.base": this.validateMessages.InvalidTransactionId,
        "number.base": this.validateMessages.InvalidTransactionId
    })

    validateTransaction(transaction: Object) {
        const { error } = this.schemaTransaction.validate(transaction)
        if (error) {
            error.message = error.message.replace(/"/g, "")
            throw new ValidationError(error.message)
        }
    }

    validateId(transactionId: string) {
        const { error } = this.schemaId.validate(transactionId)
        if (error) {
            error.message = error.message.replace(/"/g, "")
            throw new ValidationError(error.message)
        }
    }

    async getAll() {
        const transactions = await this.repository.getAll();
        return transactions.length === 0
            ? getSuccessResponse<Transaction>(StatusCode.OK, transactions, this.validateMessages.TransactionListEmpty)
            : getSuccessResponse<Transaction>(StatusCode.OK, transactions)
    }

    async getById(transactionId: string) {
        this.validateId(transactionId)
        const transaction = await this.repository.getById(parseInt(transactionId));
        return transaction
            ? getSuccessResponse<Transaction>(StatusCode.OK, transaction)
            : getErrorResponse(StatusCode.NOT_FOUND, [this.validateMessages.TransactionNotFound])
    }

    async create(transaction: Object) {
        this.validateTransaction(transaction)
        const transactionDTO = transaction as TransactionDTO
        const newTransaction = await this.repository.create(transactionDTO);
        return newTransaction
            ? getSuccessResponse<Transaction>(StatusCode.CREATED, newTransaction)
            : getErrorResponse(StatusCode.BAD_REQUEST, [this.validateMessages.TransactionCreateFailed])
    }

    async update(transactionId: string, transaction: TransactionDTO) {
        this.validateId(transactionId)
        this.validateTransaction(transaction)
        const transactionDTO = transaction as TransactionDTO
        const updatedTransaction = await this.repository.update(parseInt(transactionId), transactionDTO);
        return updatedTransaction
            ? getSuccessResponse<Transaction>(StatusCode.OK, updatedTransaction)
            : getErrorResponse(StatusCode.BAD_REQUEST, [this.validateMessages.TransactionUpdateFailed])
    }

    async delete(transactionId: string) {
        this.validateId(transactionId)
        const deletedTransaction = await this.repository.delete(parseInt(transactionId));
        return deletedTransaction
            ? getSuccessResponse<Transaction>(StatusCode.OK, deletedTransaction)
            : getErrorResponse(StatusCode.BAD_REQUEST, [this.validateMessages.TransactionDeleteFailed])
    }
}