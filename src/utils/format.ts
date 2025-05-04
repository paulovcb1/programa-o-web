import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '../types/transaction';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  if (!date) {
    return 'Data inválida';
  }

  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }
    return parsedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Data inválida';
  }
};

export const getTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
  }, 0);
};

export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getTransactionsByCategory = (transactions: Transaction[]): { name: string; value: number }[] => {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as { [key: string]: number });

  return Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getTransactionsByMonth = (transactions: Transaction[]): { name: string; income: number; expense: number }[] => {
  const today = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(today, i);
    return {
      start: startOfMonth(month),
      end: endOfMonth(month),
      name: format(month, 'MMM yyyy')
    };
  }).reverse();

  return last6Months.map(({ start, end, name }) => {
    const monthTransactions = transactions.filter(t => {
      const date = parseISO(t.date);
      return date >= start && date <= end;
    });

    return {
      name,
      income: monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      expense: monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    };
  });
};