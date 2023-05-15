import { Transaction } from "@prisma/client";
import { TransactionDTO } from "../dtos/TransactionDTO";
import { StatusCode } from "../enums/StatusCode";
import { ITransactionService } from "../interfaces/ITransactionService";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { getErrorResponse, getSuccessResponse } from "../utils/ApiResponse";

export class TransactionService implements ITransactionService {

    private repository = new TransactionRepository()

    async getAll() {
        const transactions = await this.repository.getAll();
        if (transactions.length == 0)
            return getSuccessResponse<Transaction>(StatusCode.OK, transactions, "No transactions found")
        return getSuccessResponse<Transaction>(StatusCode.OK, transactions)
    }

    async getById(transactionId: number) {
        if (isNaN(transactionId))
            return getErrorResponse(StatusCode.BAD_REQUEST, ["Invalid transaction id"])
        const transaction = await this.repository.getById(transactionId);
        if (!transaction)
            return getErrorResponse(StatusCode.NOT_FOUND, ["Transaction not found"])
        return getSuccessResponse<Transaction>(StatusCode.OK, transaction)
    }

    async create(transaction: TransactionDTO) {
        const newTransaction = await this.repository.create(transaction);
        if (newTransaction)
            return getSuccessResponse<Transaction>(StatusCode.CREATED, newTransaction)
        else
            return getErrorResponse(StatusCode.BAD_REQUEST, ["Failed to create transaction"])
    }

    async update(transactionId: number, transaction: TransactionDTO) {
        const updatedTransaction = await this.repository.update(transactionId, transaction);
        if (updatedTransaction)
            return getSuccessResponse<Transaction>(StatusCode.OK, updatedTransaction)
        else
            return getErrorResponse(StatusCode.BAD_REQUEST, ["Failed to update transaction"])
    }

    async delete(transactionId: number) {
        const deletedTransaction = await this.repository.delete(transactionId);
        if (deletedTransaction)
            return getSuccessResponse<Transaction>(StatusCode.OK, deletedTransaction)
        else
            return getErrorResponse(StatusCode.BAD_REQUEST, ["Failed to delete transaction"])
    }
}