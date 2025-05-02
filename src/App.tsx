import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Auth from './pages/Auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TransactionProvider>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <main className="pb-8">
                        <Dashboard />
                      </main>
                    </>
                  </PrivateRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <main className="pb-8">
                        <AddTransaction />
                      </main>
                    </>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </TransactionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;