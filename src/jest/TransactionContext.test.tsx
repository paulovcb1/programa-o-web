import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TransactionProvider, useTransactions } from '../context/TransactionContext';
import { api } from '../services/api';
import { Transaction } from '../types/transaction';

jest.mock('../services/api');

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 1000,
    description: 'Salary',
    category: 'Job',
    date: '2023-10-01',
    createdAt: '2023-10-01T10:00:00Z',
  },
  {
    id: '2',
    type: 'expense',
    amount: 200,
    description: 'Groceries',
    category: 'Food',
    date: '2023-10-02',
    createdAt: '2023-10-02T10:00:00Z',
  },
];

const TestComponent = () => {
  const { transactions, loading, error, getTransactions } = useTransactions();

  React.useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.id}>{transaction.description}</li>
      ))}
    </ul>
  );
};

describe('TransactionContext', () => {
  it('fetches and displays transactions', async () => {
    (api.getTransactions as jest.Mock).mockResolvedValue(mockTransactions);

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Salary/i)).toBeInTheDocument();
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });
  });

  it('displays an error message when fetching transactions fails', async () => {
    (api.getTransactions as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch transactions/i)).toBeInTheDocument();
    });
  });
});