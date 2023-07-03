import { prisma } from '../../prisma';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { ITransactionRepository } from '../interfaces/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {

    async getAll() {
        const transactions = await prisma.transaction.findMany()
        return transactions
    }

    async getAllByType(type: "income" | "outcome") {
        const transactions = await prisma.transaction.findMany({
            where: {
                type: {
                    equals: type
                }
            },
        })
        return transactions
    }

    async getById(id: number) {
        const transaction = await prisma.transaction.findUnique({
            where: { id }
        })
        return transaction
    }

    async create(transaction: TransactionDTO) {
        const newTransaction = await prisma.transaction.create({
            data: {
                date: new Date(transaction.date),
                amount: parseFloat(transaction.amount.toString()),
                description: transaction.description.trim(),
                type: transaction.type.toLowerCase(),
                category: transaction.category.toLowerCase()
            }
        })
        return newTransaction
    }

    async update(id: number, transaction: TransactionDTO) {
        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: transaction
        })
        return updatedTransaction
    }

    async delete(id: number) {
        const deletedTransaction = await prisma.transaction.delete({
            where: { id }
        })
        return deletedTransaction
    }

}