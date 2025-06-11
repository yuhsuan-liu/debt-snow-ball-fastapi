// Interface for a debt object
export interface Debt {
    name: string;
    balance: number;
    min_payment: number;
    interest_rate: number;
    created_at?: string;  //Timestamp
}