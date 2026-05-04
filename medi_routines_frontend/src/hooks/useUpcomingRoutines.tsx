import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import routineService, {type GetUpcomingRoutinesResponse} from "../services/routineService";
import { handleErrorsAfterLogin } from "../utils/errors/handlers";

type UpcomingRoutine = GetUpcomingRoutinesResponse["upcomingRoutines"][number];

// Return type for the hook
type UseUpcomingRoutinesReturnType = [
    boolean, // loading
    UpcomingRoutine[], // upcoming medicines to take
    // setter function
    React.Dispatch<React.SetStateAction<UpcomingRoutine[]>>,
    Error | null, // error
];

/**
 * Hook to fetch upcoming medicines that need to be taken today
 * Only returns medicines that have NOT yet been taken
 */
function useUpcomingRoutines(token: string | null): UseUpcomingRoutinesReturnType
{
    // State for loading, data, and errors
    const [loading, setLoading] = useState<boolean>(true);
    const [upcomingRoutines, setUpcomingRoutines] = useState<UpcomingRoutine[]>([]);
    const [error, setError] = useState<Error | null>(null);
    
    const navigate = useNavigate();

    // Function to fetch upcoming medicines
    const fetchUpcomingRoutines = async () =>
    {

        setLoading(true);
        setError(null);

        routineService
            .getUpcomingRoutines({ token: token! })
            .then((response) => {
                setUpcomingRoutines(response.upcomingRoutines);
            })
            .catch((err: Error) => {
                setError(err);
                handleErrorsAfterLogin(err, navigate);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Fetch data on mount
    useEffect(() => {
        fetchUpcomingRoutines();
    }, []);

    // Return loading state, data, error
    return [loading, upcomingRoutines, setUpcomingRoutines, error];
}

export default useUpcomingRoutines;
export type { UpcomingRoutine };