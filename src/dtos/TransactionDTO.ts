import { TransactionCategoryEnum } from "../enums/Transaction";

export class TransactionDTO {
    id?: number;
    date: Date = new Date();
    amount: number = 0;
    description: string = "";
    type: string = "outcome";
    category: string = TransactionCategoryEnum.Others;

    constructor(date: string, amount: number, description: string, type: string, category: string) {
        this.date = new Date(date);
        this.amount = amount;
        this.description = description.toLowerCase();
        this.type = type.toLowerCase();
        this.category = category.toLowerCase();
    }
}