import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationError } from "../exceptions/ValidationError";
import { getErrorResponse } from "../utils/ApiResponse";
import { Prisma } from "@prisma/client";

const treatedExceptions = [
    ValidationError,
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientInitializationError
]

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {

    if (!err) {
        next()
        return
    }

    const isTreatedException = treatedExceptions.some(e => err instanceof e)

    if (isTreatedException) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            err.message = "Transaction not found"
        }
        const { statusCode, ...clientResponse } = getErrorResponse(400, [err.message])
        res.status(statusCode).json({ ...clientResponse })
    }

    else {
        console.error(err);
        const { statusCode, ...clientResponse } = getErrorResponse(500, ["Internal server error"])
        res.status(statusCode).json({ ...clientResponse })
    }

}

export { errorHandler };