import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionFormData } from '../types/transaction';
import { api } from '../services/api';

interface TransactionContextProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  getTransactions: () => Promise<void>;
  getTransaction: (id: string) => Promise<Transaction | undefined>;
  addTransaction: (transaction: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, transaction: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTransaction = async (id: string): Promise<Transaction | undefined> => {
    try {
      const transaction = await api.getTransaction(id);
      return transaction;
    } catch (err) {
      setError('Failed to fetch transaction');
      console.error(err);
      return undefined;
    }
  };

  const addTransaction = async (transaction: TransactionFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newTransaction = await api.createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      setError('Failed to add transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: TransactionFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTransaction = await api.updateTransaction(id, transaction);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
    } catch (err) {
      setError('Failed to update transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        getTransactions,
        getTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};