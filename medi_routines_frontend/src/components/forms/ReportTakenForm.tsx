
// to report one routine's some medicines taken

import { useForm, type SubmitHandler } from "react-hook-form";
import type { UpcomingRoutine } from "../../hooks/useUpcomingRoutines";
import type { CreateMultipleTakenRequest, Taken } from "../../services/takenService";
import { useAppSelector } from "../../store/hooks";
import { useCallback, useState } from "react";
import takenService from "../../services/takenService";
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";
import { useNavigate } from "react-router";
import Checkbox from "../input/Checkbox";

interface ReportTakenFormProps extends UpcomingRoutine
{
    // function to mark the medicines as reported, so that the parent component can update the state
    onReportTaken: (routineId: string, date: string, day: string, time: string, takenMedicines: Taken[]) => void;
}

// form to report taken medicines of a routine
// will have checkboxes for each upcoming medicine in the routine
// and a submit button to report taken

interface ReportTakenData
{
    routineMedicines: string[]; // array of routine medicine ids that are taken
    // the routineId, routineName, localDate, localDay, localTime are not needed here
    // as they are already passed as props
}

function ReportTakenForm(
    {
        routineId,
        routineName,
        localDate,
        localDay,
        localTime,
        routineMedicines,
        onReportTaken,
    }: ReportTakenFormProps)
{

    // get the token from store
    const token = useAppSelector(store=>store.user.token);

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ReportTakenData>({
        defaultValues: {
            // by default, no medicines are selected
            routineMedicines: []
        }
    });

    // submit loading state
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // navigate
    const navigate = useNavigate();

    // function to handle submit
    const onSubmit: SubmitHandler<ReportTakenData> = useCallback((data) =>
    {
        setSubmitLoading(true);

        // create the request data
        const requestData: CreateMultipleTakenRequest = {
            token: token!,
            routine: routineId,
            routineMedicines: data.routineMedicines,
            date: localDate,
            day: localDay,
            time: localTime
        };

        // here we will call the service to report taken medicines
        // using the data and token
        takenService.createMultipleTaken(requestData)
        .then((resp) => {
            
            // successfully reported taken medicines
            // call the onReportTaken function passed from parent
            console.log(resp.takens);
            onReportTaken(routineId, localDate, localDay, localTime, resp.takens);
            // remove from props
            // routineMedicines = routineMedicines.filter(r=>!data.routineMedicines.includes(r.routineMedicineId));
            // remove the routineMedicineId from form
            reset({routineMedicines:[]});

        })
        .catch((err: Error) => {
            console.log(err);
            handleErrorsAfterLogin(err, navigate);
        })
        .finally(() => {
            setSubmitLoading(false);
        });
    }, [setSubmitLoading, navigate, token, routineId, onReportTaken]);    return (

        // routine card
        <div className="border rounded-lg p-4 bg-white shadow-sm">

            <p className="font-medium text-lg mb-3">{routineName}: <span className="text-gray-600">{localDay}, {localTime}: {localDate}</span></p>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* display a checkbox for each routine medicine */}
                {/* at least one medicine must be selected */}
                <div className="space-y-2 mb-4">
                    {routineMedicines.map((medicine) => (
                        <div key={medicine.routineMedicineId} className="flex items-center gap-2">
                            <Checkbox
                                label={medicine.routineMedicineName}
                                type="checkbox"
                                value={medicine.routineMedicineId}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                {...register("routineMedicines", {
                                    validate: {
                                        notEmpty: (value) => value.length > 0 || "Please select at least one medicine"
                                    }
                                })}
                            />
                        </div>
                    ))}
                </div>

                {errors.routineMedicines && (
                    <p className="text-red-500 text-sm mb-3">Please select at least one medicine</p>
                )}

                {/* submit button */}

                <button 
                    type="submit" 
                    disabled={submitLoading}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {submitLoading ? 'Reporting...' : 'Report Taken'}
                </button>
            </form>

        </div>

    );
}

export default ReportTakenForm;