import React from 'react';
import Button from '../input/Button'; // Assuming your Button component path

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // The action to perform on confirmation
    title: string;
    children: React.ReactNode; // The message/content of the dialog
    confirmButtonText?: string;
    cancelButtonText?: string;
    isConfirmLoading?: boolean; // To show loading state on the confirm button
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    isConfirmLoading = false,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose} // Close when clicking the overlay
        >
            {/* Dialog Box */}
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
            >
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <div className="text-gray-700 mb-6">
                    {children}
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        className=""
                        disabled={isConfirmLoading}
                    >
                        {cancelButtonText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white" // Destructive action style
                        disabled={isConfirmLoading}
                    >
                        {isConfirmLoading ? "Processing..." : confirmButtonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;