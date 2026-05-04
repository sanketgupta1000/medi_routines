// could not find some medicines to be added to the routine
class MedicineNotFoundError extends Error
{
    constructor(message: string)
    {
        super(message);
    }
}

// could not find the routine
class RoutineNotFoundError extends Error
{
    constructor(message: string)
    {
        super(message);
    }
}

export {
    MedicineNotFoundError,
    RoutineNotFoundError
};