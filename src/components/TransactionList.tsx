import React, { useState } from 'react';
import { Transaction } from '../types/transaction';
import { formatCurrency, formatDate } from '../utils/format';
import { Edit2, Trash2, ArrowDown, ArrowUp, Filter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onEdit, 
  onDelete,
  isLoading
}) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transações</h2>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
            className="p-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">Todas</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUp className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3" />
                      )}
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;