import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, BarChart2, PlusCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Controle Financeiro</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-1" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link 
              to="/add" 
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <div className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-1" />
                <span>Nova Transação</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;