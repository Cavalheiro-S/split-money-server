import { prisma } from '../../prisma';
import { TransactionModel } from '../models/TransactionModel'

export class TransactionRepository {
    

    async getAll() {
        try {
            await prisma.$connect()
            const transactions = await prisma.transaction.findMany()
            return transactions
        }
        catch (error) {
            console.log(error);
            return []
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async getById(id: number) {
        try {
            await prisma.$connect()
            const transaction = await prisma.transaction.findUnique({
                where: {
                    id: id
                }
            })
            return transaction
        }
        catch (error) {
            console.log(error);
            return null
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async create(transaction: TransactionModel) {
        try {
            await prisma.$connect()
            const newTransaction = await prisma.transaction.create({
                data: transaction
            })
            return newTransaction
        }
        catch (error) {
            console.log(error);
            return null
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async update(id: number, transaction: TransactionModel) {
        try {
            await prisma.$connect()
            const updatedTransaction = await prisma.transaction.update({
                where: {
                    id: id
                },
                data: transaction
            })
            return updatedTransaction
        }
        catch (error) {
            console.log(error);
            return null
        }
        finally {
            await prisma.$disconnect()
        }
    }

    async delete(id: number) {
        try {
            await prisma.$connect()
            const deletedTransaction = await prisma.transaction.delete({
                where: {
                    id: id
                }
            })
            return deletedTransaction
        }
        catch (error) {
            console.log(error);
            return null
        }
        finally {
            await prisma.$disconnect()
        }
    }

}