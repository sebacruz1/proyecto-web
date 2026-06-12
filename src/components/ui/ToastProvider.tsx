import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from "react-icons/io5";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType; id: number } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToast({ message, type, id });
    
    // La notificación desaparecerá automáticamente después de 4 segundos
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Renderizado visual de la notificación flotante */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl bg-white p-4 shadow-2xl border border-slate-200 transition-all">
          {toast.type === "success" ? (
            <IoCheckmarkCircle className="h-6 w-6 text-emerald-500" />
          ) : (
            <IoAlertCircle className="h-6 w-6 text-red-500" />
          )}
          <p className="text-sm font-medium text-slate-700">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 transition"
            aria-label="Cerrar notificación"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Hook personalizado para usar las notificaciones en cualquier parte
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser usado dentro de un ToastProvider");
  }
  return context;
}