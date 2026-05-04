import { useEffect, useState } from "react";
import predefinedMedicineService, { type PredefinedMedicine } from "../services/predefinedMedicineService";

// Return type
type UsePredefinedMedicinesReturnType = [boolean, PredefinedMedicine[], Error | null];

function usePredefinedMedicines(token: string | null): UsePredefinedMedicinesReturnType
{
    // Loading state
    const [isLoading, setLoading] = useState<boolean>(true);
    // Data state
    const [predefinedMedicines, setPredefinedMedicines] = useState<PredefinedMedicine[]>([]);
    // Error state
    const [error, setError] = useState<Error | null>(null);

    // Fetch data when token changes
    useEffect(() => {

        setLoading(true);
        setError(null);

        // Fetch predefined medicines
        predefinedMedicineService
            .getAllPredefinedMedicines({ token: token! })
            .then((response) => {
                setPredefinedMedicines(response.predefinedMedicines);
            })
            .catch((err: Error) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return [isLoading, predefinedMedicines, error];
}

export default usePredefinedMedicines;