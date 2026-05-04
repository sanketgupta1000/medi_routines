import CreateRoutineForm from "../forms/CreateRoutineForm";

function CreateRoutinePage()
{
    return (        <>
        

            <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-6">Create Routine</h2>

                <CreateRoutineForm />
            </div>

        </>

    );
}

export default CreateRoutinePage;