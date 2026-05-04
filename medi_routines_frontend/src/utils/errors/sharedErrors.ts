// network error
class NetworkError extends Error
{
    constructor(message:string)
    {
        super(message);
    }
}

// invalid data sent to server
class InvalidDataError extends Error
{
    constructor(message:string)
    {
        super(message);
    }
}

// all others
class UnknownError extends Error
{
    constructor(message:string)
    {
        super(message);
    }
}

export {
    NetworkError,
    InvalidDataError,
    UnknownError
};