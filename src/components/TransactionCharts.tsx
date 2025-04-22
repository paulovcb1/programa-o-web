import React from 'react';
import { Transaction } from '../types/transaction';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getTransactionsByCategory, getTransactionsByMonth } from '../utils/format';

interface TransactionChartsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B66FF'];

const TransactionCharts: React.FC<TransactionChartsProps> = ({ transactions, isLoading }) => {
  const monthlyData = getTransactionsByMonth(transactions);
  const categoryData = getTransactionsByCategory(transactions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-medium mb-4">Receitas vs Despesas (Últimos 6 meses)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value}`, '']} 
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" name="Receitas" fill="#10B981" />
              <Bar dataKey="expense" name="Despesas" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-medium mb-4">Despesas por Categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TransactionCharts;