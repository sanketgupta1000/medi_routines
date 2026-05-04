// user already exists
class UserExistsError extends Error
{
    constructor(message:string)
    {
        super(message);
    }
}

// user not found
class UserNotFoundError extends Error
{
    constructor(message:string)
    {
        super(message);
    }
}

// invalid credentials
class InvalidCredentialsError extends Error
{
    constructor(message:string)
    {
        super(message);
    }
}

export {
    UserExistsError,
    UserNotFoundError,
    InvalidCredentialsError
};