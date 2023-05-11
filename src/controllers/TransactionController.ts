import { Request, Response, Router } from "express";
import { ValidationError } from "../exceptions/ValidationError";
import { TransactionModel } from "../models/TransactionModel";
import { TransactionRepository } from "../repositories/TransactionRepository";

const routerTransaction = Router()

// GET /api/transaction
routerTransaction.get("/", async (req: Request, res: Response) => {
    try {

        const repository = new TransactionRepository()
        const transactions = await repository.getAll()
        if (transactions.length > 0)
            res.status(200).json({ message: "Successfully obtained transactions", data: transactions })
        else
            res.status(404).json({ message: "No transactions found" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
})

// GET /api/transaction/1
routerTransaction.get("/:id", async (req: Request, res: Response) => {
    try {

        const transactionId = parseInt(req.params.id)
        if (isNaN(transactionId))
            res.status(400).json({ message: "Invalid transaction id" })
        const repository = new TransactionRepository()
        const transaction = await repository.getById(transactionId)
        if (transaction)
            res.status(200).json({ message: "Successfully obtained transaction", data: transaction })
        else
            res.status(404).json({ message: "Transaction not found" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }

})

// POST /api/transaction
routerTransaction.post("/", async (req: Request<any, any, TransactionDTO>, res: Response) => {

    try {

        const repository = new TransactionRepository()
        const transactionModel = new TransactionModel(req.body)
        const transaction = await repository.create(transactionModel)
        if (transaction)
            res.status(201).json({ message: "Successfully created transaction", data: transaction })
        else
            res.status(400).json({ message: "Transaction not created" })

    }
    catch (error) {
        console.log(error);
        if (error instanceof ValidationError)
            res.status(400).json({ message: error.message })
        else
            res.status(500).json({ message: "Internal server error" })
    }
})

// PATCH /api/transaction/1
routerTransaction.patch("/:id", async (req: Request, res: Response) => {
    try {

        const transactionId = parseInt(req.params.id)
        const repository = new TransactionRepository()
        const transactionModel = new TransactionModel(req.body)
        const transaction = await repository.update(transactionId, transactionModel)
        if (transaction)
            res.status(200).json({ message: "Successfully updated transaction", data: transaction })
        else
            res.status(404).json({ message: "Transaction not found" })

    }
    catch (error) {
        console.log(error);
        if (error instanceof ValidationError)
            res.status(400).json({ message: error.message })
        else
            res.status(500).json({ message: "Internal server error" })
    }
})

// DELETE /api/transaction/1
routerTransaction.delete("/:id", async (req: Request, res: Response) => {
    try {

        const transactionId = parseInt(req.params.id)
        const repository = new TransactionRepository()
        const transaction = await repository.delete(transactionId)
        if (transaction)
            res.status(200).json({ message: "Successfully deleted transaction", data: transaction })
        else
            res.status(404).json({ message: "Transaction not found" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
})


export { routerTransaction };

