
// to register a taken medicine

import config from "../configs/config";
import { RoutineNotFoundError } from "../utils/errors/routineErrors";
import { InvalidDataError, NetworkError, UnknownError } from "../utils/errors/sharedErrors";
import { TakenAlreadyExistsError } from "../utils/errors/takenErrors";
import { InvalidCredentialsError } from "../utils/errors/userErrors";
import type { DayOfWeek, TimeOfDay } from "./routineService";

interface Taken
{
    id: string;
    routine: string;
    routineMedicine: string;
    // date in DD/MM/YYYY format
    date: string;
    // day
    day: DayOfWeek;
    // time
    time: TimeOfDay;
};

interface CreateTakenRequest
{
    token: string;
    routine: string;
    routineMedicine: string;
    date: string;
    day: DayOfWeek;
    time: TimeOfDay;
};

interface CreateTakenResponse
{
    taken: Taken;
};

interface CreateMultipleTakenRequest
{
    token: string;
    routine: string;
    routineMedicines: string[];
    date: string;
    day: DayOfWeek;
    time: TimeOfDay;
};

interface CreateMultipleTakenResponse
{
    takens: Taken[];
};

class TakenService
{
    // method to create a new taken medicine
    async createTaken(request: CreateTakenRequest): Promise<CreateTakenResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/taken`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
                body: JSON.stringify({
                    routine: request.routine,
                    routineMedicine: request.routineMedicine,
                    date: request.date,
                    day: request.day,
                    time: request.time,
                }),
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if (response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }

        if (response.status === 422)
        {
            throw new InvalidDataError((await response.json()).message);
        }

        if(response.status === 404)
        {
            throw new RoutineNotFoundError((await response.json()).message);
        }

        if(response.status === 409)
        {
            throw new TakenAlreadyExistsError((await response.json()).message);
        }


        if (response.status !== 201)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as CreateTakenResponse;
    }

    // to mark multiple medicines as taken of a specific routine on a specific date, day, and time
    async createMultipleTaken(request: CreateMultipleTakenRequest): Promise<CreateMultipleTakenResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/taken/multiple`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
                body: JSON.stringify({
                    routine: request.routine,
                    routineMedicines: request.routineMedicines,
                    date: request.date,
                    day: request.day,
                    time: request.time,
                }),
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if (response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }

        if (response.status === 422)
        {
            throw new InvalidDataError((await response.json()).message);
        }

        if(response.status === 404)
        {
            throw new RoutineNotFoundError((await response.json()).message);
        }

        if(response.status === 409)
        {
            throw new TakenAlreadyExistsError((await response.json()).message);
        }

        if (response.status !== 201)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as CreateMultipleTakenResponse;
    }

}

export default new TakenService();
export type {
    Taken,
    CreateTakenRequest,
    CreateTakenResponse,
    CreateMultipleTakenRequest,
    CreateMultipleTakenResponse
};