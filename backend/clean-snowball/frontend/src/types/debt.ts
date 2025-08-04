// Interface for a debt object
export interface Debt {
    name: string;
    balance: number;
    min_payment: number;
    interest_rate: number;
    id?: number;  // Optional because new debts won't have an ID yet
    created_at?: string;  // Optional timestamp
}