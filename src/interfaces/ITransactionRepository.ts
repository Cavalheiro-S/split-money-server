import { Transaction } from "@prisma/client";

export interface ITransactionRepository {
    getAll(): Promise<Transaction[]>;
    getById(transactionId: number): Promise<Transaction | null>;
    create(transaction: TransactionDTO): Promise<Transaction | null>;
    update(transactionId: number, transaction: TransactionDTO): Promise<Transaction | null>;
}