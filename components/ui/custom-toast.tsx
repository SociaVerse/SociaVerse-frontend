"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

// --- Types ---
type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
    onDismiss?: () => void
}

interface ToastStore {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, "id">) => void
    removeToast: (id: string) => void
}

// --- Store (using simple state management or Context) ---
// We'll use a simple global event emitter or Context for simplicity in this file. 
// Actually, let's use a React Context to make it easy to use via hook.

const ToastContext = React.createContext<{
    toast: (props: Omit<Toast, "id">) => void
    confirm: (props: ConfirmProps) => Promise<boolean>
} | null>(null)


// --- Components ---

export const useToast = () => {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

interface ConfirmProps {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "default"
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([])
    const [confirmDialog, setConfirmDialog] = React.useState<ConfirmProps & { isOpen: boolean, resolve: (value: boolean) => void } | null>(null)

    const toast = React.useCallback(({ type, title, message, duration = 3000 }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts(prev => [...prev, { id, type, title, message, duration }])

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, duration)
        }
    }, [])

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const confirm = React.useCallback((props: ConfirmProps) => {
        return new Promise<boolean>((resolve) => {
            setConfirmDialog({ ...props, isOpen: true, resolve })
        })
    }, [])

    const handleConfirm = (r: boolean) => {
        if (confirmDialog) {
            confirmDialog.resolve(r)
            setConfirmDialog(null)
        }
    }

    return (
        <ToastContext.Provider value={{ toast, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Confirm Dialog Overlay */}
            <AnimatePresence>
                {confirmDialog && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">{confirmDialog.title}</h3>
                            <p className="text-slate-400 mb-6">{confirmDialog.description}</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => handleConfirm(false)}
                                    className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors font-medium"
                                >
                                    {confirmDialog.cancelText || "Cancel"}
                                </button>
                                <button
                                    onClick={() => handleConfirm(true)}
                                    className={`px-4 py-2 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${confirmDialog.variant === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                                        }`}
                                >
                                    {confirmDialog.confirmText || "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    )
}

function ToastItem({ toast, onDismiss }: { toast: Toast, onDismiss: () => void }) {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-400" />
    }

    const bgs = {
        success: "bg-neutral-900/90 border-green-500/20",
        error: "bg-neutral-900/90 border-red-500/20",
        info: "bg-neutral-900/90 border-blue-500/20",
        warning: "bg-neutral-900/90 border-amber-500/20"
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-md ${bgs[toast.type]}`}
        >
            <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{toast.title}</h4>
                {toast.message && <p className="text-slate-400 text-xs mt-1 leading-relaxed">{toast.message}</p>}
            </div>
            <button onClick={onDismiss} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
