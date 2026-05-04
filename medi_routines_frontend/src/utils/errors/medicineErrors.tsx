class RoutineExistsWhileDeletingMedicineError extends Error
{
    constructor(message: string) {
        super(message);
    }
}

export {
    RoutineExistsWhileDeletingMedicineError
};