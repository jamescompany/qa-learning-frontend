import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      icon: '✓',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
    },
    error: {
      icon: '✕',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
    },
    info: {
      icon: 'ℹ',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center`}>
            <span className={`text-xl font-bold ${style.iconColor}`}>{style.icon}</span>
          </div>
          <div className="ml-4 flex-1">
            {title && (
              <h3 className={`text-lg font-semibold ${style.titleColor} mb-1`}>
                {title}
              </h3>
            )}
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;