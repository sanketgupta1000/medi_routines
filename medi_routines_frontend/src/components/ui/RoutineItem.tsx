import { Link, useNavigate } from "react-router"; // Ensure using react-router-dom
import type { Routine } from "../../services/routineService";
import { useCallback } from "react";
import routineService from "../../services/routineService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";
import { removeRoutine } from "../../store/slices/routineSlices";
import Button from "../input/Button";

interface RoutineItemProps {
    routine: Routine;
    index: number;
    // Function passed from parent to open the confirmation dialog
    openConfirmationDialog: (
        title: string,
        message: React.ReactNode,
        onConfirmCallback: () => Promise<void>,
        confirmButtonText?: string
    ) => void;
}

function RoutineItem({
    routine,
    index,
    openConfirmationDialog // Receive this prop
}: RoutineItemProps) {

    const token = useAppSelector(store => store.user.token);
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    // This is the actual delete logic for THIS specific routine item
    const performDeleteRoutine = useCallback(async () =>
    {
        try
        {
            await routineService.deleteRoutine(
            {
                token: token!,
                routineId: routine.id
            });
            appDispatch(removeRoutine({routineId: routine.id})); // Pass routine.id directly
            // Success: Modal will close. Optionally show a success toast here.
        }
        catch (err)
        {
            console.error("Deletion failed for routine:", routine.id, err);
            handleErrorsAfterLogin(err as Error, navigate);
        }
    }, [token, routine, appDispatch, navigate]);

    const handleDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        // Call the parent's function to open the dialog,
        // passing the title, message, and the specific delete action for this routine.
        openConfirmationDialog(
            "Confirm Deletion", // Title for the dialog
            <>Are you sure you want to delete the routine "<strong>{routine.name}</strong>"? This action cannot be undone.</>, // Message
            performDeleteRoutine, // The function to execute on confirmation
            "Delete" // Custom text for the confirm button
        );
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <Link to={`/routines/${index}`} className="hover:underline flex-grow mr-4">
                    <h3 className="text-xl font-medium text-blue-600">{routine.name}</h3>
                </Link>
                <Button
                    onClick={(e)=>{handleDeleteButtonClick(e!);}}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm flex-shrink-0"
                    // The button on the item itself doesn't need to show "Deleting..."
                    // as the modal's confirm button will handle the primary loading state.
                    // You could disable it if isDeleteProcessActive is true,
                    // but that state might be tricky to sync perfectly with the modal's lifecycle.
                    // For simplicity, let's assume the modal handles the visual feedback of processing.
                >
                    Delete
                </Button>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Medicines:</p>
            <ul className="ml-4 text-gray-600 list-disc list-inside">
                {routine.medicines && routine.medicines.length > 0 ? (
                    routine.medicines.map((med) => (
                        <li key={med.id || med.medicine.id} className="text-sm py-0.5">
                            {med.medicine.name}
                        </li>
                    ))
                ) : (
                    <li className="text-sm py-0.5 text-gray-500 italic">No medicines in this routine.</li>
                )}
            </ul>
        </div>
    );
}

export default RoutineItem;