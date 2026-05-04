import { useEffect, useState } from 'react';
import './App.css'
import { useAppDispatch, useAppSelector } from './store/hooks';
import authService, { type GetUserResponse } from './services/authService';
import { login, logout, setRoutines, setUserDefinedMedicines } from './store/slices';
import userDefinedMedicineService from './services/userDefinedMedicineService';
import routineService from './services/routineService';
import { handleErrorsAfterLogin } from './utils/errors/handlers';
import { Outlet, useNavigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Header from './components/ui/Header';
import {requestNotificationPermission} from "./services/notificationService";

// App.tsx will be the parent most component
// its purpose is to fetch the user and their other data if the user is logged in on the app load

function App()
{

    // app loading state
    const [appLoading, setAppLoading] = useState<boolean>(true);

    // token
    const token = useAppSelector(store=>store.user.token);

    const isLoggedIn = useAppSelector(store=>store.user.isLoggedIn);

    // dispatcher
    const appDispatch = useAppDispatch();

    const navigate = useNavigate();

    // useEffect to fetch user data if any on app load, and whenever token changes
    useEffect(()=>
    {

        setAppLoading(true);

        if(token)
        {
            // token exists
            // try to fetch user

            authService
            .getUser({token: token})
            .then((getUserResp: GetUserResponse)=>
            {
                
                // fetched user successfully
                // log him in
                appDispatch(login({
                    token: token,
                    userId: getUserResp.id,
                    userName: getUserResp.name,
                    userEmail: getUserResp.email
                }));

            })
            .then(()=>
            {
                // now fetch the user's medicines
                return userDefinedMedicineService
                .getAllUserDefinedMedicines({token})
            })
            .then((getAllUserDefinedMedicinesResp)=>
            {
                // set in store
                appDispatch(setUserDefinedMedicines({
                    userDefinedMedicines: getAllUserDefinedMedicinesResp.userDefinedMedicines
                }));
            })
            .then(()=>
            {
                // now fetch the routines
                return routineService
                .getAllRoutines({token});
            })
            .then((getAllRoutinesResp)=>
            {
                // set in store
                appDispatch(setRoutines({
                    routines: getAllRoutinesResp.routines
                }));
            })
            .catch((err: Error)=>
            {
                console.log(err);
                handleErrorsAfterLogin(err, navigate);
            })
            .finally(()=>
            {
                // stop loading
                setAppLoading(false);
            })

        }
        else
        {
            // no token
            // clear data
            appDispatch(setRoutines({routines:[]}));
            appDispatch(setUserDefinedMedicines({userDefinedMedicines: []}));
            appDispatch(logout());
            setAppLoading(false);
        }

    }, [token]);

    // useEffect for push notifications
    useEffect(()=>
    {
        if(isLoggedIn)
        {
            // user is logged in
            const setupnNotifications = async()=>
            {
                console.log("Attempting to setup push notifications");
                try
                {
                    await requestNotificationPermission(token!);
                }
                catch(err)
                {
                    console.log(err);
                    handleErrorsAfterLogin(err, navigate);
                }
            }
            setupnNotifications();
        }
    }, [isLoggedIn]);


    return (
        <>
            {/* toaster */}
            <Toaster
                position='top-right'
                reverseOrder={false}
            />

            <Header />
            
            {
            appLoading?
            <div>Loading...</div>
            :


            <Outlet/>
            }

        </>
    )
}

export default App;
