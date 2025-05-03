import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/transaction';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../utils/format';

interface ExpenseListProps {
  userId: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, selectedMonth, selectedCategory]);

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions.filter(transaction => 
      transaction.type === 'expense' &&
      transaction.date.startsWith(selectedMonth)
    );

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(transaction => 
        transaction.category === selectedCategory
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newTransaction = {
        type: 'expense' as const,
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date
      };

      await api.createTransaction(newTransaction, userId);
      await loadTransactions();
      setShowForm(false);
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Lista de Despesas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          aria-label="adicionar despesa"
        >
          Adicionar Despesa
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">
            Selecionar Mês
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="2025-04">Abril 2025</option>
            <option value="2025-05">Maio 2025</option>
          </select>
        </div>

        <div>
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">
            Selecionar Categoria
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Utilities">Utilidades</option>
            <option value="Food">Alimentação</option>
            <option value="Health">Saúde</option>
            <option value="Others">Outros</option>
          </select>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-4 p-4 border rounded" role="form">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Valor
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Utilities">Utilidades</option>
                <option value="Food">Alimentação</option>
                <option value="Health">Saúde</option>
                <option value="Others">Outros</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-700 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(parseISO(transaction.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;