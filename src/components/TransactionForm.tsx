import React, { useState, useEffect, useRef } from 'react';
import { Transaction, TransactionFormData, TransactionType } from '../types/transaction';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction;
  isEditing?: boolean;
  categories?: { type: TransactionType; name: string }[];
}

const initialFormState: TransactionFormData = {
  type: 'expense',
  amount: 0,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0]
};

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSubmit, 
  initialData,
  isEditing = false,
  categories = []
}) => {
  const [formData, setFormData] = useState<TransactionFormData>(initialData || initialFormState);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const hasCleanedCategory = useRef(false);

  // 1. Atualiza categorias filtradas quando tipo muda
useEffect(() => {
  const filtered = categories
    .filter(cat => cat.type === formData.type)
    .map(cat => cat.name);

  // Apenas atualiza se realmente mudou
  setFilteredCategories(prev => {
    const isSame = prev.length === filtered.length && prev.every((val, i) => val === filtered[i]);
    return isSame ? prev : filtered;
  });
}, [categories, formData.type]);

// 2. Limpa categoria inválida se necessário
useEffect(() => {
  if (
    formData.category &&
    !filteredCategories.includes(formData.category)
  ) {
    // Só limpa se necessário
    setFormData(prev => {
      if (prev.category === '') return prev;
      return { ...prev, category: '' };
    });
  }
}, [formData.category, filteredCategories]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.amount || formData.amount <= 0) {
      validationErrors.push('O campo "Valor" deve ser maior que zero.');
    }
    if (!formData.description.trim()) {
      validationErrors.push('O campo "Descrição" é obrigatório.');
    }
    if (!formData.category.trim()) {
      validationErrors.push('O campo "Categoria" é obrigatório.');
    }
    if (!formData.date.trim()) {
      validationErrors.push('O campo "Data" é obrigatório.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSubmit(formData);

    if (!isEditing) {
      setFormData(initialFormState);
    }
  };

  return (
    <form data-testid="transaction-form" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Transação' : 'Nova Transação'}
      </h2>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

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
