export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
  userId?: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}