import { Transaction } from "@prisma/client";
import { IServiceResponse } from "./IServiceResponse";

export interface ITransactionService {
    getAll(): Promise<IServiceResponse<Transaction>>
    getById(transactionId: string): Promise<IServiceResponse<Transaction>>
    create(transaction: any): Promise<IServiceResponse<Transaction>>
    update(transactionId: string, transaction: any): Promise<IServiceResponse<Transaction>>
    delete(transactionId: string): Promise<IServiceResponse<Transaction>>
}