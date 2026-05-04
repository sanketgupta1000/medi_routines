
// will display all the upcoming medicines of routines to be taken today
// with checkbox for selecting medicine and button for reporting taken for each routine

import { useCallback, useEffect } from "react";
import useUpcomingRoutines from "../../hooks/useUpcomingRoutines";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";
import { useNavigate } from "react-router";
import ReportTakenForm from "../forms/ReportTakenForm";
import type { Taken } from "../../services/takenService";
import { addTakenMedicines } from "../../store/slices/routineSlices";

function UpcomingRoutinesPage()
{

    // token from store
    const token = useAppSelector(store=>store.user.token);

    // upcoming routines
    const [upcomingLoading, upcomingRoutines, setUpcomingRoutines, error] = useUpcomingRoutines(token);

    const navigate = useNavigate();

    const appDispatch = useAppDispatch();
console.log("re-render")
    // handle error if any
    useEffect(()=>
    {

        if(!upcomingLoading)
        {
            // finished loading
            if(error)
            {
                // error
                console.log(error);
                // handle
                handleErrorsAfterLogin(error, navigate);
            }
        }

    }, [upcomingLoading]);

    // function to handle reporting taken
    const onReportTaken = useCallback((routineId: string, date: string, day: string, time: string, takenMedicines: Taken[]) =>
    {

        setUpcomingRoutines((prevRoutines) =>
                    prevRoutines.map((routine) => 
                    {
                        if(routine.routineId === routineId && routine.localDate === date && routine.localDay === day && routine.localTime === time)
                        {
                            // update the routine's medicines to remove the reported ones
                            const updatedRoutine = {
                                ...routine,
                                routineMedicines: routine.routineMedicines.filter(medicine => !takenMedicines.some(taken => taken.routineMedicine === medicine.routineMedicineId)),
                            };
                            if(updatedRoutine.routineMedicines.length === 0)
                            {
                                // if no medicines left, mark for removal
                                return undefined; 
                            }
                            // return the updated routine
                            return updatedRoutine;
                        }
                        return routine;
                    }).filter(routine => routine !== undefined) as typeof prevRoutines // Filter out undefined values and assert type
                );

        // also update the redux store
        appDispatch(addTakenMedicines({ routineId, takenMedicines }));

    }, [setUpcomingRoutines, appDispatch]);    // if loading, return loading state
    if(upcomingLoading)
    {
        return (
            <div className="flex justify-center items-center min-h-[200px] text-gray-600">Loading...</div>
        );
    }

    return (

        <div className="max-w-3xl mx-auto px-4 py-6">

            <h2 className="text-2xl font-semibold mb-6">Upcoming Routines</h2>

            <div className="space-y-6">
                {upcomingRoutines.map((routine) => (
                    
                        <ReportTakenForm
                            key={routine.routineId + routine.localDate + routine.localDay + routine.localTime}
                            routineId={routine.routineId}
                            routineName={routine.routineName}
                            localDate={routine.localDate}
                            localDay={routine.localDay}
                            localTime={routine.localTime}
                            routineMedicines={routine.routineMedicines}
                            onReportTaken={onReportTaken}
                        />

                ))}
            </div>
            

        </div>

    );
}

export default UpcomingRoutinesPage;