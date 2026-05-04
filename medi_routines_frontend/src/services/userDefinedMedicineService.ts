import config from "../configs/config";
import { RoutineExistsWhileDeletingMedicineError } from "../utils/errors/medicineErrors";
import { MedicineNotFoundError } from "../utils/errors/routineErrors";
import { InvalidDataError, NetworkError, UnknownError } from "../utils/errors/sharedErrors";
import { InvalidCredentialsError } from "../utils/errors/userErrors";

interface UserDefinedMedicine
{
    id: string;
    name: string;
};

interface CreateUserDefinedMedicineRequest
{
    token: string;
    name: string;
};

interface UserDefinedMedicineResponse
{
    userDefinedMedicine: UserDefinedMedicine;
};

interface GetAllUserDefinedMedicinesRequest
{
    token: string;
};

interface GetAllUserDefinedMedicinesResponse
{
    userDefinedMedicines: UserDefinedMedicine[];
};

interface DeleteUserDefinedMedicineRequest
{
    token: string;
    userDefinedMedicine: string;
}

class UserDefinedMedicineService
{
    // method to create a new user-defined medicine
    async createUserDefinedMedicine(request: CreateUserDefinedMedicineRequest): Promise<UserDefinedMedicineResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user-defined-medicine`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
                body: JSON.stringify({
                    name: request.name,
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
        if(response.status!=201)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as UserDefinedMedicineResponse;
    }

    // method to get all user-defined medicines
    async getAllUserDefinedMedicines(request: GetAllUserDefinedMedicinesRequest): Promise<GetAllUserDefinedMedicinesResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user-defined-medicine`, 
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
        if(response.status!=200)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as GetAllUserDefinedMedicinesResponse;
    }

    // method to delete user defined medicine
    async deleteUserDefinedMedicine(request: DeleteUserDefinedMedicineRequest): Promise<void>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user-defined-medicine/${request.userDefinedMedicine}`, 
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
            throw new InvalidCredentialsError('Invalid credentials, please login again');
        }
        if(response.status === 404)
        {
            throw new MedicineNotFoundError('Predefined medicine not found');
        }
        if(response.status === 409)
        {
            throw new RoutineExistsWhileDeletingMedicineError('Cannot delete medicine as it is used in one or more routines');
        }

        if(response.status != 204)
        {
            throw new UnknownError('An unknown error occurred');
        }
        // No content to return, just ensure the request was successful
        return;
    }
};

export default new UserDefinedMedicineService();
export type {
    UserDefinedMedicine,
    CreateUserDefinedMedicineRequest,
    UserDefinedMedicineResponse,
    GetAllUserDefinedMedicinesRequest,
    GetAllUserDefinedMedicinesResponse
};