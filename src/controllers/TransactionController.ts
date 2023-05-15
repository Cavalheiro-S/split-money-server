import { Request, Response, Router } from "express";
import { TransactionDTO } from "../dtos/TransactionDTO";
import { IControllerResponse } from "../interfaces/IControllerResponse";
import { asyncErrorHandler } from "../midllewares/AsyncErrorHandler";
import { TransactionService } from "../services/TransactionService";
import { Transaction } from "@prisma/client";

const routerTransaction = Router()

const service = new TransactionService()

// GET /api/transaction
routerTransaction.get("/", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { statusCode, ...clientResponse } = await service.getAll()
    res.status(statusCode).json({ ...clientResponse })
}))

// GET /api/transaction/1
routerTransaction.get("/:id", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const transactionId = parseInt(req.params.id)
    const { statusCode, ...clientResponse } = await service.getById(transactionId)
    res.status(statusCode).json({ ...clientResponse })
}))

// POST /api/transaction
routerTransaction.post("/", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { date, amount, description, type, category } = req.body
    const transaction = new TransactionDTO(date, amount, description, type, category)
    const { statusCode, ...clientResponse } = await service.create(transaction)
    res.status(statusCode).json({ ...clientResponse })
}))

// PATCH /api/transaction/1
routerTransaction.patch("/:id", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const transactionId = parseInt(req.params.id)
    const { statusCode, ...clientResponse } = await service.update(transactionId, req.body)
    res.status(statusCode).json({ ...clientResponse })
}))

// DELETE /api/transaction/1
routerTransaction.delete("/:id", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const transactionId = parseInt(req.params.id)
    const { statusCode, ...clientResponse } = await service.delete(transactionId)
    res.status(statusCode).json({ ...clientResponse })
}))

export { routerTransaction };

