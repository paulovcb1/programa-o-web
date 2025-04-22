import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';

function App() {
  return (
    <Router>
      <TransactionProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddTransaction />} />
            </Routes>
          </main>
        </div>
      </TransactionProvider>
    </Router>
  );
}

export default App;