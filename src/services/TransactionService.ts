import { Transaction } from "@prisma/client";
import z from "zod";
import { VALIDATION_MESSAGES } from "../consts/ValidationMessages";
import { TransactionDTO } from "../dtos/TransactionDTO";
import { StatusCode } from "../enums/StatusCode";
import { TransactionCategoryEnum, TransactionTypeEnum } from "../enums/Transaction";
import { ValidationError } from "../exceptions/ValidationError";
import { ITransactionService } from "../interfaces/ITransactionService";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { getErrorResponse, getSuccessResponse } from "../utils/ApiResponse";
import { schemaId } from "../utils/ValidationSchema";

export class TransactionService implements ITransactionService {

    private repository = new TransactionRepository()

    private validCategories = Object.values(TransactionCategoryEnum) as string[]

    private validTypes = z.string().includes(TransactionTypeEnum.Income).or(z.string().includes(TransactionTypeEnum.Outcome))

    private schemaTransaction = z.object({
        id: z.number().optional(),
        date: z.coerce.date(),
        amount: z.coerce.number(),
        description: z.string().min(3).max(50),
        type: this.validTypes,
        category: z.string().refine((data) => this.validCategories.includes(data.toLocaleLowerCase()))
    })

    validateTransaction(transaction: Object) {
        const transactionParsed = this.schemaTransaction.parse(transaction)
        if (transactionParsed.category === "")
            if (!transactionParsed) {
                throw new ValidationError(VALIDATION_MESSAGES.InvalidTransaction)
            }
    }

    validateId(transactionId: string) {
        const transactionIdParsed = schemaId.parse(transactionId)
        if (!transactionIdParsed) {
            throw new ValidationError(VALIDATION_MESSAGES.InvalidTransactionId)
        }
    }

    async getAll() {
        const transactions = await this.repository.getAll();
        return transactions.length === 0
            ? getSuccessResponse<Transaction>(StatusCode.OK, transactions, VALIDATION_MESSAGES.TransactionListEmpty)
            : getSuccessResponse<Transaction>(StatusCode.OK, transactions)
    }

    async getAllByCategory(type: string) {
        const typeParsed = this.validTypes.parse(type)
        if (!typeParsed) {
            throw new ValidationError(VALIDATION_MESSAGES.InvalidTransactionType)
        }

        const transactions = await this.repository.getAllByType(typeParsed as TransactionTypeEnum);
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