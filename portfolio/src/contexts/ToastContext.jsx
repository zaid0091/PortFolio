import { createContext, useContext, useState, useCallback } from 'react';
import { toastActions } from './toastActions';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => toastActions.success(addToast, message, duration),
        error: (message, duration) => toastActions.error(addToast, message, duration),
        info: (message, duration) => toastActions.info(addToast, message, duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

export function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '400px',
                width: '100%',
            }}
        >
            {toasts.map(t => (
                <Toast key={t.id} toast={t} onRemove={onRemove} />
            ))}
        </div>
    );
}

export function Toast({ toast: t, onRemove }) {
    const config = {
        success: { bg: '#a8e6cf', labelColor: '#1a5c30', label: 'SUCCESS' },
        error: { bg: '#ff6b9d', labelColor: '#7a1f3f', label: 'ERROR' },
        info: { bg: '#ffd93d', labelColor: '#5a4500', label: 'INFO' },
    }[t.type] || { bg: '#ffd93d', labelColor: '#5a4500', label: 'INFO' };

    return (
        <div
            role="alert"
            aria-live="polite"
            onClick={() => onRemove(t.id)}
            style={{
                background: config.bg,
                border: '3px solid #000',
                boxShadow: '5px 5px 0 #000',
                padding: '14px 18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'toastSlideIn 0.2s ease-out',
                fontFamily: 'var(--font-sans)',
                color: '#000',
            }}
        >
            <span
                style={{
                    background: config.labelColor,
                    color: '#fff',
                    padding: '2px 8px',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    border: '2px solid #000',
                    flexShrink: 0,
                    marginTop: '1px',
                }}
            >
                {config.label}
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, wordBreak: 'break-word' }}>
                {t.message}
            </span>
        </div>
    );
}
