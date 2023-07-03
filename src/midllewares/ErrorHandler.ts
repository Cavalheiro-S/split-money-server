import { Prisma } from "@prisma/client";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationError } from "../exceptions/ValidationError";
import { getErrorResponse } from "../utils/ApiResponse";
import { ZodError } from "zod";

const treatedExceptions = [
    ValidationError,
    ZodError,
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
        let errors = []
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            errors.push("Transaction not found")
        }
        else if (err instanceof ZodError) {
            errors = err.issues.map(issue => issue.path + ": " + issue.message)
        }
        else
            errors.push(err.message)
        const { statusCode, ...clientResponse } = getErrorResponse(400, [...errors])
        res.status(statusCode).json({ ...clientResponse })
    }

    else {
        console.error(err);
        const { statusCode, ...clientResponse } = getErrorResponse(500, ["Internal server error"])
        res.status(statusCode).json({ ...clientResponse })
    }

}

export { errorHandler };
