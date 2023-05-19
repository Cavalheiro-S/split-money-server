export interface IControllerResponse<T> {
    message: string;
    data?: T | T[];
    errors?: string[];
}