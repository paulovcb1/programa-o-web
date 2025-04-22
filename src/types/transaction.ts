export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}