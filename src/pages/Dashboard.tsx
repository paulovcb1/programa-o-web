import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import DashboardSummary from '../components/DashboardSummary';
import TransactionList from '../components/TransactionList';
import TransactionCharts from '../components/TransactionCharts';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import { Transaction } from '../types/transaction';

const Dashboard: React.FC = () => {
  const { 
    transactions, 
    loading, 
    error,
    getTransactions, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    getTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData: any) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, formData);
      setEditingTransaction(null);
      setIsModalOpen(false);
      await getTransactions();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      await deleteTransaction(id);
      await getTransactions();
    }
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Painel Financeiro</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            Filtrar por:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todas as Transações</option>
            <option value="income">Apenas Receitas</option>
            <option value="expense">Apenas Despesas</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Editar Transação"
      >
        {editingTransaction && (
          <TransactionForm 
            onSubmit={handleUpdate} 
            initialData={editingTransaction}
            isEditing={true}
          />
        )}
      </Modal>
      
      <DashboardSummary transactions={filteredTransactions} isLoading={loading} />
      
      <TransactionCharts transactions={filteredTransactions} isLoading={loading} />
      
      <TransactionList 
        transactions={filteredTransactions} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
};

export default Dashboard;