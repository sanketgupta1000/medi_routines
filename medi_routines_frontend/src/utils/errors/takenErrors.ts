class TakenAlreadyExistsError extends Error
{
    constructor(message: string)
    {
        super(message);
    }
}

export {
    TakenAlreadyExistsError
};