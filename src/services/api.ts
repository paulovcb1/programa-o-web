import axios from 'axios';
import { Transaction, TransactionFormData } from '../types/transaction';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Get all transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  },
  
  // Get a single transaction
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await axios.get(`${API_URL}/transactions/${id}`);
    return response.data;
  },
  
  // Create a new transaction
  createTransaction: async (transaction: TransactionFormData): Promise<Transaction> => {
    const response = await axios.post(`${API_URL}/transactions`, transaction);
    return response.data;
  },
  
  // Update a transaction
  updateTransaction: async (id: string, transaction: TransactionFormData): Promise<Transaction> => {
    const response = await axios.put(`${API_URL}/transactions/${id}`, transaction);
    return response.data;
  },
  
  // Delete a transaction
  deleteTransaction: async (id: string): Promise<{ id: string; message: string }> => {
    const response = await axios.delete(`${API_URL}/transactions/${id}`);
    return response.data;
  }
};