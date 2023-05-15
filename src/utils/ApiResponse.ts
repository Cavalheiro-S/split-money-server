import { StatusCode } from "../enums/StatusCode"

function getSuccessResponse<T>(statusCode: StatusCode, data?: T | T[] | null, message?: string) {
    return { statusCode: statusCode, message: message ?? "The request was successfully processed", data: data ?? [], errors: [] }
}

function getErrorResponse(statusCode: StatusCode, errors: string[]) {
    return { statusCode: statusCode, message: "The request was not successfully processed", data: [], errors: errors ?? [] }
}

export { getSuccessResponse, getErrorResponse }