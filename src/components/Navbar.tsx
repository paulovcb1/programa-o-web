import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, BarChart2, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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
          <div className="flex items-center space-x-4">
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
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <div className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-1" />
                <span>Nova Transação</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 mr-1" />
                <span>Sair</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;