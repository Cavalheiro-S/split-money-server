import { Transaction } from "@prisma/client";
import { Request, Response, Router } from "express";
import Joi from "joi";
import { TransactionCategoryEnum } from "../enums/TransactionCategoryEnum";
import { ValidationError } from "../exceptions/ValidationError";
import { IControllerResponse } from "../interfaces/IControllerResponse";
import { asyncErrorHandler } from "../midllewares/AsyncErrorHandler";
import { TransactionService } from "../services/TransactionService";

const routerTransaction = Router()

const service = new TransactionService()


// Estudar como implementar o callback
// const baseControllerCallback = async (req: Request, res: Response<IControllerResponse<Transaction>>, callback: Function) => {
//     const { statusCode, ...clientResponse } = await callback()
//     res.status(statusCode).json({ ...clientResponse })
// }

// GET /api/transaction
routerTransaction.get("/", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { statusCode, ...clientResponse } = await service.getAll()
    res.status(statusCode).json({ ...clientResponse })
}))

// GET /api/transaction/1
routerTransaction.get("/:id", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { statusCode, ...clientResponse } = await service.getById(req.params.id)
    res.status(statusCode).json({ ...clientResponse })
}))

// POST /api/transaction
routerTransaction.post("/", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { statusCode, ...clientResponse } = await service.create(req.body)
    res.status(statusCode).json({ ...clientResponse })
}))

// PATCH /api/transaction/1
routerTransaction.patch("/:id", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { statusCode, ...clientResponse } = await service.update(req.params.id, req.body)
    res.status(statusCode).json({ ...clientResponse })
}))

// DELETE /api/transaction/1
routerTransaction.delete("/:id", asyncErrorHandler(async (req: Request, res: Response<IControllerResponse<Transaction>>) => {
    const { statusCode, ...clientResponse } = await service.delete(req.params.id)
    res.status(statusCode).json({ ...clientResponse })
}))

export { routerTransaction };
