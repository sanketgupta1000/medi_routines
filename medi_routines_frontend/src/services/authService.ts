// will write functions for authentication here

import config from '../configs/config';
import { InvalidDataError, NetworkError, UnknownError } from '../utils/errors/sharedErrors';
import { InvalidCredentialsError, UserExistsError } from '../utils/errors/userErrors';
import type { Timezone } from './timezoneService';

// define the type for the signup function
interface SignupRequest
{
    name: string;
    email: string;
    password: string;
    timezone: Timezone;
};

interface SignupResponse
{
    name: string;
    email: string;
    timezone: Timezone;
};

// define the type for the login function
interface LoginRequest
{
    email: string;
    password: string;
};

interface LoginResponse
{
    token: string;
};

// define the type for the get user function
interface GetUserRequest
{
    token: string;
};

interface GetUserResponse
{
    id: string;
    name: string;
    email: string;
    timezone: string;
};

class AuthService
{
    // method to signup
    async signup(data: SignupRequest): Promise<SignupResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user/signup`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        }
        catch (error)
        {
            console.log(error);
            // network error
            throw new NetworkError('Please check your internet connection and try again.');
        }

        // got the response, check code
        if(response.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==409)
        {
            // email already exists
            throw new UserExistsError((await response.json()).message);
        }
        else if(response.status!=201)
        {
            throw new UnknownError('An unknown error occurred. Please try again later.');
        }
        // if we reach here, it means the request was successful

        return (await response.json()) as SignupResponse;
    }

    // method to login
    async login(data: LoginRequest): Promise<LoginResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user/login`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        }
        catch (error)
        {
            console.log(error);
            // network error
            throw new NetworkError('Please check your internet connection and try again.');
        }

        // got the response, check code
        if(response.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        else if(response.status!=200)
        {
            throw new UnknownError('An unknown error occurred. Please try again later.');
        }
        // if we reach here, it means the request was successful

        return (await response.json()) as LoginResponse;
    }

    // method to get the user
    async getUser(data: GetUserRequest): Promise<GetUserResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`,
                },
            });
        }
        catch (error)
        {
            console.log(error);
            // network error
            throw new NetworkError('Please check your internet connection and try again.');
        }

        if(response.status==401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        else if(response.status!=200)
        {
            throw new UnknownError('An unknown error occurred. Please try again later.');
        }
        // if we reach here, it means the request was successful

        return (await response.json()) as GetUserResponse;
    }

}

export default new AuthService();
export type {
    SignupRequest,
    SignupResponse,
    LoginRequest,
    LoginResponse,
    GetUserRequest,
    GetUserResponse
};