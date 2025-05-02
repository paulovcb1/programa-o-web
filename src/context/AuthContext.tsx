import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { app } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está cadastrado');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres');
          break;
        default:
          setError('Erro ao criar conta. Tente novamente.');
      }
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha incorretos');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError('Erro ao fazer logout');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        signUp, 
        signIn, 
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};