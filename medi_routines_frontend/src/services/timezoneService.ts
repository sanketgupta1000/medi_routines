import config from "../configs/config";
import { NetworkError, UnknownError } from "../utils/errors/sharedErrors";

type Timezone = string;

class TimezoneService
{

    // to get all timezones
    async getAllTimezones(): Promise<Timezone[]>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.timezoneUrl}/api/timezone/availabletimezones`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error)
        {
            throw new NetworkError("Could not fetch timezones");
        }

        if (!response.ok)
        {
            throw new UnknownError("Could not fetch timezones");
        }

        const data = await response.json();
        return data as Timezone[];
    }

};

export default new TimezoneService();
export type {
    Timezone,
};