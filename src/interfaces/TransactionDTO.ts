interface TransactionDTO {
    id?: number;
    date: string;
    amount: number;
    description?: string;
    type: string;
    category: string;
}