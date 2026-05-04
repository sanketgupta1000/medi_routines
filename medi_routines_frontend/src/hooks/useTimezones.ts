// will create hooks for fetching data
// and since rendering should be pure, will use useEffect to fetch it

import { useEffect, useState } from "react";
import timezoneService, { type Timezone } from "../services/timezoneService";

// return type
type UseTimezonesReturnType = [boolean, Timezone[], Error | null];

function useTimezones() : UseTimezonesReturnType
{
    // loading state
    const [isLoading, setLoading] = useState<boolean>(true);
    // data
    const [timezones, setTimezones] = useState<Timezone[]>([]);
    // error state
    const [error, setError] = useState<Error|null>(null);

    // need to just fetch once, so will pass empty dependency array
    useEffect(()=>
    {

        setLoading(true);

        // fetch
        timezoneService
        .getAllTimezones()
        .then((timezones)=>
        {
            setTimezones(timezones);
        })
        .catch((err:Error)=>
        {
            setError(err);
        })
        .finally(()=>
        {
            setLoading(false);
        });

    }, []);

    return [isLoading, timezones, error];

}

export default useTimezones;