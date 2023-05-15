import { IControllerResponse } from "./IControllerResponse";

export interface IServiceResponse<T> extends IControllerResponse<T> {
    statusCode: number;
}