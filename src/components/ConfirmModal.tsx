'use client';

import { MdOutlineWarning, MdOutlineClose } from 'react-icons/md';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Conferma',
    cancelText = 'Annulla',
    isDanger = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/40 transition-opacity"
                    onClick={onClose}
                />
                
                {/* Modal */}
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <MdOutlineClose className="h-6 w-6" />
                    </button>

                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 rounded-full p-3 ${isDanger ? 'bg-red-100' : 'bg-yellow-100'}`}>
                            <MdOutlineWarning className={`h-6 w-6 ${isDanger ? 'text-red-600' : 'text-yellow-600'}`} />
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-150 ${
                                isDanger 
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

