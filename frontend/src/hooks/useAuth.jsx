import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUsername());

  const login = useCallback(async (username, password) => {
    const res = await authService.login(username, password);
    authService.saveTokens(res.data);
    setUser(res.data.username);
  }, []);

  const register = useCallback(async (username, password) => {
    const res = await authService.register(username, password);
    authService.saveTokens(res.data);
    setUser(res.data.username);
  }, []);

  const logout = useCallback(() => {
    authService.clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
