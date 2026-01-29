'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';

type ModalType = 'success' | 'error' | 'info' | 'warning' | 'confirm';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showModal: (type: ModalType, title: string, message: string, onClose?: () => void) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string, confirmText?: string, cancelText?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showModal = useCallback((type: ModalType, title: string, message: string, onClose?: () => void) => {
    setModal({ isOpen: true, type, title, message, onClose });
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showModal('success', title || 'Success', message);
  }, [showModal]);

  const showError = useCallback((message: string, title?: string) => {
    showModal('error', title || 'Error', message);
  }, [showModal]);

  const showInfo = useCallback((message: string, title?: string) => {
    showModal('info', title || 'Info', message);
  }, [showModal]);

  const showWarning = useCallback((message: string, title?: string) => {
    showModal('warning', title || 'Warning', message);
  }, [showModal]);

  const showConfirm = useCallback((
    message: string,
    onConfirm: () => void,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: title || 'Confirm',
      message,
      onConfirm,
      confirmText: confirmText || 'Confirm',
      cancelText: cancelText || 'Cancel'
    });
  }, []);

  const closeModal = useCallback(() => {
    if (modal.onClose) {
      modal.onClose();
    }
    setModal(prev => ({ ...prev, isOpen: false }));
  }, [modal.onClose]);

  const handleConfirm = useCallback(() => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    setModal(prev => ({ ...prev, isOpen: false }));
  }, [modal.onConfirm]);

  const getIcon = () => {
    const iconClass = "w-8 h-8";
    switch (modal.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-500`} />;
      case 'confirm':
        return <Trash2 className={`${iconClass} text-red-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getColors = () => {
    switch (modal.type) {
      case 'success':
        return { bg: 'bg-green-50', border: 'border-green-200', button: 'bg-green-600 hover:bg-green-700' };
      case 'error':
        return { bg: 'bg-red-50', border: 'border-red-200', button: 'bg-red-600 hover:bg-red-700' };
      case 'warning':
        return { bg: 'bg-amber-50', border: 'border-amber-200', button: 'bg-amber-600 hover:bg-amber-700' };
      case 'confirm':
        return { bg: 'bg-red-50', border: 'border-red-200', button: 'bg-red-600 hover:bg-red-700' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', button: 'bg-blue-600 hover:bg-blue-700' };
    }
  };

  const colors = getColors();
  const isConfirmModal = modal.type === 'confirm';

  return (
    <ModalContext.Provider value={{ showModal, showSuccess, showError, showInfo, showWarning, showConfirm, closeModal }}>
      {children}

      {/* Modal Overlay */}
      {modal.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in ${colors.border} border-2`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${colors.bg} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                {getIcon()}
                <h3 className="text-lg font-bold text-gray-900">{modal.title}</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-gray-700 leading-relaxed">{modal.message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              {isConfirmModal ? (
                <>
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    {modal.cancelText || 'Cancel'}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-5 py-2.5 ${colors.button} text-white font-semibold rounded-xl transition-colors`}
                  >
                    {modal.confirmText || 'Confirm'}
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className={`px-6 py-2.5 ${colors.button} text-white font-semibold rounded-xl transition-colors`}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
