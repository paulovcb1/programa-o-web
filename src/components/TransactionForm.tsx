import React, { useState, useEffect } from 'react';
import { Transaction, TransactionFormData, TransactionType } from '../types/transaction';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

const initialFormState: TransactionFormData = {
  type: 'expense',
  amount: 0,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0]
};

const categories = [
  // Income categories
  { type: 'income', name: 'Salário' },
  { type: 'income', name: 'Freelance' },
  { type: 'income', name: 'Investimentos' },
  { type: 'income', name: 'Presentes' },
  { type: 'income', name: 'Outras Receitas' },
  // Expense categories
  { type: 'expense', name: 'Alimentação' },
  { type: 'expense', name: 'Moradia' },
  { type: 'expense', name: 'Transporte' },
  { type: 'expense', name: 'Lazer' },
  { type: 'expense', name: 'Saúde' },
  { type: 'expense', name: 'Educação' },
  { type: 'expense', name: 'Compras' },
  { type: 'expense', name: 'Utilidades' },
  { type: 'expense', name: 'Outras Despesas' },
];

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSubmit, 
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<TransactionFormData>(initialData || initialFormState);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount,
        description: initialData.description,
        category: initialData.category,
        date: initialData.date.split('T')[0]
      });
    }
  }, [initialData]);

  useEffect(() => {
    const filtered = categories
      .filter(cat => cat.type === formData.type)
      .map(cat => cat.name);
    setFilteredCategories(filtered);
    
    if (!filtered.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData(initialFormState);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Transação' : 'Nova Transação'}
      </h2>
      
      <div className="flex space-x-2 mb-6">
        <button
          type="button"
          className={`flex items-center justify-center w-1/2 py-2 rounded-md transition-all ${
            formData.type === 'income'
              ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
              : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
          }`}
          onClick={() => handleTypeChange('income')}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Receita
        </button>
        <button
          type="button"
          className={`flex items-center justify-center w-1/2 py-2 rounded-md transition-all ${
            formData.type === 'expense'
              ? 'bg-red-100 text-red-700 border-2 border-red-500'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50'
          }`}
          onClick={() => handleTypeChange('expense')}
        >
          <MinusCircle className="mr-2 h-5 w-5" />
          Despesa
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
        >
          {isEditing ? 'Atualizar Transação' : 'Adicionar Transação'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;