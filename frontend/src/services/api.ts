import { Debt } from '../types/debt';

const API_BASE_URL = 'http://localhost:8000';

export const userApi = {
    async createUser(username: string) {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        if (!response.ok) {
            throw new Error('Failed to create user');
        }
        return response.json();
    },

    async saveDebts(username: string, debts: Debt[]) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/debts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(debts),
        });
        if (!response.ok) {
            throw new Error('Failed to save debts');
        }
        return response.json();
    },

    async loadDebts(username: string) {
        const response = await fetch(`${API_BASE_URL}/users/${username}/debts/`);
        if (!response.ok) {
            throw new Error('Failed to load debts');
        }
        return response.json();
    },
};