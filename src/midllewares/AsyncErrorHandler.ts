import { Request, Response, NextFunction } from 'express'

const asyncErrorHandler = (handler: Function) =>
    (req: Request, res: Response, next: NextFunction) =>
        handler(req, res).catch(next)

export { asyncErrorHandler }