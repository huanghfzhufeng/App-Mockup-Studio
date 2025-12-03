import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast 类型配置
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: Info,
    className: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
  },
};

// 单个 Toast 组件
function ToastItem({ id, type = 'info', message, onClose }) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm
        shadow-lg animate-slide-in ${config.className}
      `}
    >
      <Icon size={18} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-black/10 rounded-lg transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Toast 容器组件
export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

// Toast Hook
let toastId = 0;
let globalAddToast = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 暴露全局方法
  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  const toast = {
    success: (message) => addToast('success', message),
    error: (message) => addToast('error', message),
    warning: (message) => addToast('warning', message),
    info: (message) => addToast('info', message),
  };

  return { toasts, toast, removeToast };
}

// 全局 toast 方法（可在任何地方调用）
export const toast = {
  success: (message) => globalAddToast?.('success', message),
  error: (message) => globalAddToast?.('error', message),
  warning: (message) => globalAddToast?.('warning', message),
  info: (message) => globalAddToast?.('info', message),
};
