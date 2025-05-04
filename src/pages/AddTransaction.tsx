import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import { useTransactions } from '../context/TransactionContext';
import { TransactionFormData } from '../types/transaction';

const AddTransaction: React.FC = () => {
  const { addTransaction, loading, error } = useTransactions();
  const navigate = useNavigate();

  const handleSubmit = async (formData: TransactionFormData) => {
    await addTransaction(formData);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Adicionar nova Transação</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <TransactionForm onSubmit={handleSubmit} />
      
      <div className="text-center mt-4">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;