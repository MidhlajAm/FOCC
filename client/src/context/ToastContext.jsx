import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message) => {
    setToasts((current) => [...current, { message, id: Date.now() }]);
    setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t, i) => (
          <div className="toast" key={i}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
