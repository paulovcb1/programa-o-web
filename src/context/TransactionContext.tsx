import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionFormData } from '../types/transaction';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();

  const getTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTransactions(user.uid);
      setTransactions(data);
    } catch (err) {
      setError('Falha ao carregar transações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTransaction = async (id: string): Promise<Transaction | undefined> => {
    if (!user) return undefined;
    
    try {
      const transaction = await api.getTransaction(id, user.uid);
      return transaction;
    } catch (err) {
      setError('Falha ao carregar transação');
      console.error(err);
      return undefined;
    }
  };

  const addTransaction = async (transaction: TransactionFormData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const newTransaction = await api.createTransaction(transaction, user.uid);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      setError('Falha ao adicionar transação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: TransactionFormData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedTransaction = await api.updateTransaction(id, transaction, user.uid);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
    } catch (err) {
      setError('Falha ao atualizar transação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      await api.deleteTransaction(id, user.uid);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Falha ao excluir transação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

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