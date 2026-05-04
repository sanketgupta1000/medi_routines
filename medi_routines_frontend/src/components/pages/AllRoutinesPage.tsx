import { useNavigate, Link } from "react-router"; // Ensure using react-router-dom
import { useAppSelector } from "../../store/hooks"; // Removed useAppDispatch as it's not used directly here now
import Button from "../input/Button";
import RoutineItem from "../ui/RoutineItem";
import ConfirmationDialog from "../ui/ConfirmationDialog"; // Import the new dialog
import { useState, useCallback } from "react";
import type { Routine } from "../../services/routineService"; // Assuming this type is correct
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";

function AllRoutinesPage() {
    const navigate = useNavigate();
    const routines = useAppSelector(state => state.routines.routines as Routine[]);

    // State for the centralized confirmation dialog
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        title: string;
        message: React.ReactNode;
        confirmAction: () => Promise<void>; // The action to run on confirm
        confirmButtonText?: string;
    } | null>(null);
    const [isConfirmActionLoading, setIsConfirmActionLoading] = useState(false);

    // Function to be called by child components (RoutineItem) to open the dialog
    const requestConfirmation = useCallback((
        title: string,
        message: React.ReactNode,
        onConfirmCallback: () => Promise<void>, // The specific action for this confirmation
        confirmButtonText?: string
    ) => {
        setModalConfig({
            title,
            message,
            confirmAction: onConfirmCallback,
            confirmButtonText
        });
        setIsModalOpen(true);
        setIsConfirmActionLoading(false); // Reset loading state for new modal
    }, [setModalConfig, setIsModalOpen, setIsConfirmActionLoading]);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setModalConfig(null);
    }, [setIsModalOpen, setModalConfig]);

    const handleModalConfirm = useCallback(async () => {
        if (modalConfig?.confirmAction) {
            setIsConfirmActionLoading(true);
            try {
                await modalConfig.confirmAction();
                // Action itself should handle success (e.g., Redux update, notifications)
            } catch (error) {
                // Action itself should handle its errors (e.g., notifications)
                console.error("Confirmation action failed:", error);
                handleErrorsAfterLogin(error, navigate);
            } finally {
                setIsConfirmActionLoading(false);
                handleModalClose(); // Close modal after action attempt
            }
        }
    }, [modalConfig, handleModalClose, setIsConfirmActionLoading, navigate]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">Your Routines</h2>
            {routines.length === 0 ? (
                <div className="text-gray-600 bg-gray-100 p-4 rounded-md text-center">
                    No routines found. Create your first routine!
                </div>
            ) : (
                <ul className="space-y-4 mb-6">
                    {routines.map((routine, index) => (
                        <li key={routine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <RoutineItem
                                routine={routine}
                                index={index}
                                // Pass the function to request confirmation
                                openConfirmationDialog={requestConfirmation}
                            />
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                <Button onClick={() => navigate("/routines/create")} className="w-full sm:w-auto">
                    Create New Routine
                </Button>
                <Link to="/routines/upcoming" className="text-blue-600 hover:underline text-center w-full sm:w-auto">
                    View Upcoming Routines
                </Link>
            </div>

            {/* Single, Centralized Confirmation Dialog Instance */}
            {modalConfig && (
                <ConfirmationDialog
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                    title={modalConfig.title}
                    confirmButtonText={modalConfig.confirmButtonText || "Confirm"}
                    isConfirmLoading={isConfirmActionLoading}
                >
                    {modalConfig.message}
                </ConfirmationDialog>
            )}
        </div>
    );
}

export default AllRoutinesPage;