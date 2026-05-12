import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
