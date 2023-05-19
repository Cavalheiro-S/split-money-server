import { prisma } from '../../prisma';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { ITransactionRepository } from '../interfaces/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {


    async getAll() {
        try {
            const transactions = await prisma.transaction.findMany()
            return transactions
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async getById(id: number) {
        try {
            const transaction = await prisma.transaction.findUnique({
                where: {
                    id: id
                }
            })
            return transaction
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async create(transaction: TransactionDTO) {
        try {
            const newTransaction = await prisma.transaction.create({
                data: {
                    date: transaction.date,
                    amount: transaction.amount,
                    description: transaction.description,
                    type: transaction.type,
                    category: transaction.category
                }
            })
            return newTransaction
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async update(id: number, transaction: TransactionDTO) {
        try {
            const updatedTransaction = await prisma.transaction.update({
                where: {
                    id: id
                },
                data: transaction
            })
            return updatedTransaction
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async delete(id: number) {
        try {
            const deletedTransaction = await prisma.transaction.delete({
                where: {
                    id: id
                }
            })
            return deletedTransaction
        }
        finally {
            await prisma.$disconnect()
        }
    }

}