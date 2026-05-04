import config from "../configs/config";
import { MedicineNotFoundError, RoutineNotFoundError } from "../utils/errors/routineErrors";
import { InvalidDataError, NetworkError, UnknownError } from "../utils/errors/sharedErrors";
import { InvalidCredentialsError } from "../utils/errors/userErrors";
import type { PredefinedMedicine } from "./predefinedMedicineService";
import type { Taken } from "./takenService";
import type { UserDefinedMedicine } from "./userDefinedMedicineService";

// to create a routine
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
type TimeOfDay = "Morning" | "Afternoon" | "Evening" | "Night";
type MedicineType = "PredefinedMedicine" | "UserDefinedMedicine";

interface MedicineSchedule
{
    day: DayOfWeek;
    times: TimeOfDay[];
};

interface MedicineEntry
{
    medicineType: MedicineType;
    medicine: string;
    schedule: MedicineSchedule[];
};

interface CreateRoutineRequest
{
    token: string;
    name: string;
    medicines: MedicineEntry[];
};

interface Routine
{
    id: string;
    name: string;
    medicines: {
        // routine medicine id
        id: string;
        medicineType: MedicineType;
        medicine: UserDefinedMedicine | PredefinedMedicine;
        schedule: MedicineSchedule[];
    }[];
    takenMedicines: Taken[];
};

interface CreateRoutineResponse
{
    routine: Routine;
};

interface GetAllRoutinesRequest
{
    token: string;
};

interface GetAllRoutinesResponse
{
    routines: Routine[];
};

interface GetARoutineResuest
{
    token: string;
    routineId: string;
};

interface GetARoutineResponse
{
    routine: Routine;
};

interface GetUpcomingRoutinesRequest
{
    token: string;
};

interface GetUpcomingRoutinesResponse
{
    upcomingRoutines: {
        routineId: string;
        routineName: string;
        localDate: string;
        localDay: DayOfWeek;
        localTime: TimeOfDay;
        routineMedicines: {
            routineMedicineId: string;
            routineMedicineName: string;
        }[];
    }[];
};

interface DeleteRoutineRequest
{
    token: string;
    routineId: string;
};

class RoutineService
{
    // create a new routine
    async createRoutine(request: CreateRoutineRequest): Promise<CreateRoutineResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/routine`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
                body: JSON.stringify({
                    name: request.name,
                    medicines: request.medicines,
                }),
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status === 422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        if(response.status === 404)
        {
            // couldn't find some medicines
            throw new MedicineNotFoundError((await response.json()).message);
        }
        if(response.status != 201)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as CreateRoutineResponse;
    }

    // get all routines
    async getAllRoutines(request: GetAllRoutinesRequest): Promise<GetAllRoutinesResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/routine`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status != 200)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as GetAllRoutinesResponse;
    }

    // get a routine by id
    async getARoutine(request: GetARoutineResuest): Promise<GetARoutineResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/routine/${request.routineId}`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status === 404)
        {
            throw new RoutineNotFoundError((await response.json()).message);
        }
        if(response.status != 200)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as GetARoutineResponse;
    }

    // get upcoming routines
    async getUpcomingRoutines(request: GetUpcomingRoutinesRequest): Promise<GetUpcomingRoutinesResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/routine/upcoming`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status != 200)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as GetUpcomingRoutinesResponse;
    }

    // delete a routine
    async deleteRoutine(request: DeleteRoutineRequest): Promise<void>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/routine/${request.routineId}`, 
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status === 404)
        {
            throw new RoutineNotFoundError((await response.json()).message);
        }
        if(response.status != 204)
        {
            throw new UnknownError('An unknown error occurred');
        }
        // if we reach here, the routine was deleted successfully
        return;
    }

}

export default new RoutineService();
export type {
    Routine,
    CreateRoutineRequest,
    MedicineEntry,
    MedicineSchedule,
    DayOfWeek,
    TimeOfDay,
    MedicineType,
    CreateRoutineResponse,
    GetAllRoutinesRequest,
    GetAllRoutinesResponse,
    GetARoutineResuest,
    GetARoutineResponse,
    GetUpcomingRoutinesRequest,
    GetUpcomingRoutinesResponse
};