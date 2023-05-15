import { Transaction } from "@prisma/client";
import { IServiceResponse } from "./IServiceResponse";

export interface ITransactionService {
    getAll(): Promise<IServiceResponse<Transaction>>
    getById(transactionId: number): Promise<IServiceResponse<Transaction>>
    create(transaction: any): Promise<IServiceResponse<Transaction>>
    update(transactionId: number, transaction: any): Promise<IServiceResponse<Transaction>>
    delete(transactionId: number): Promise<IServiceResponse<Transaction>>
}