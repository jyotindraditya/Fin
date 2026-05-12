import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ExpenseList from './components/Expenses/ExpenseList';
import CategoryList from './components/Categories/CategoryList';
import SettingsPage from './components/Settings/SettingsPage';
import AuthPage from './components/Auth/AuthPage';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

function AuthenticatedApp() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AuthenticatedApp /> : <AuthPage />;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}
