import config from "../configs/config";
import { NetworkError, UnknownError } from "../utils/errors/sharedErrors";

interface PredefinedMedicine
{
    id: string;
    name: string;
};

interface PredefinedMedicineRequest
{
    token: string;
};

interface PredefinedMedicineResponse
{
    predefinedMedicines: PredefinedMedicine[];
};

class PredefinedMedicineService
{

    // method to get all predefined medicines
    async getAllPredefinedMedicines(request: PredefinedMedicineRequest): Promise<PredefinedMedicineResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/predefined-medicine`, 
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

        if (!response.ok)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as PredefinedMedicineResponse;
    }

}

export default new PredefinedMedicineService();
export type {
    PredefinedMedicine,
    PredefinedMedicineResponse,
    PredefinedMedicineRequest
};