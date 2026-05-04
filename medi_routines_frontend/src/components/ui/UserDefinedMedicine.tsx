import { useCallback, useState } from 'react'
import userDefinedMedicineService from '../../services/userDefinedMedicineService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeUserDefinedMedicine } from '../../store/slices/userDefinedMedicinesSlice';
import { handleErrorsAfterLogin } from '../../utils/errors/handlers';
import { useNavigate } from 'react-router';
import Button from '../input/Button';

interface UserDefinedMedicineProps
{
    id: string;
    name: string;
}

function UserDefinedMedicine({
    id,
    name
}: UserDefinedMedicineProps)
{

    // delete loading state
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const token = useAppSelector(store=>store.user.token);
    
    const appDispatch = useAppDispatch();

    const navigate = useNavigate();

    // Function to handle delete medicine
    const handleDeleteMedicine = useCallback(async () => {
        // Set loading state for the specific medicine
        setDeleteLoading(true);
        
        userDefinedMedicineService
        .deleteUserDefinedMedicine(
            {
                token: token!,
                userDefinedMedicine: id
            }
        )
        .then(()=>
        {
            // deleted, now remove from store
            appDispatch(
                removeUserDefinedMedicine({ userDefinedMedicineId: id })
            );

        })
        .catch((error) =>
        {
            // handle error
            console.log(error);
            handleErrorsAfterLogin(error, navigate);
        })
        .finally(() => {
            // Reset loading state for the specific medicine
            setDeleteLoading(false);
        });

    }, [setDeleteLoading, token, navigate]);

    return (
        
        <li  
            className="p-3 hover:bg-gray-50 flex justify-between items-center"
        >
            <span>{name}</span>
            {/* delete button at right */}
            <Button 
                onClick={() => handleDeleteMedicine()}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={deleteLoading}
            >
                {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
        </li>

    )
}

export default UserDefinedMedicine