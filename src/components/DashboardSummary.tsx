import React from 'react';
import { Transaction } from '../types/transaction';
import { formatCurrency, getTotalBalance, getTotalIncome, getTotalExpenses } from '../utils/format';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface DashboardSummaryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ transactions, isLoading }) => {
  const totalBalance = getTotalBalance(transactions);
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Saldo Total</p>
            <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total de Receitas</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total de Despesas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;