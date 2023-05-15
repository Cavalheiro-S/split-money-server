import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationError } from "../exceptions/ValidationError";
import { getErrorResponse } from "../utils/ApiResponse";

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {

    if (err) {
        
        if (err instanceof ValidationError) {
            const { statusCode, ...clientResponse } = getErrorResponse(400, [err.message])
            res.status(statusCode).json({ ...clientResponse })
        }
        else {
            const { statusCode, ...clientResponse } = getErrorResponse(500, ["Internal server error"])
            res.status(statusCode).json({ ...clientResponse })
        }
    }
    else
        next()

}

export { errorHandler };