import CreateUserDefinedMedicineForm from "../forms/CreateUserDefinedMedicineForm";
function CreateUserDefinedMedicinePage()
{
    return (        <>
        

            <div className="max-w-md mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-6">Create Medicine</h2>

                <CreateUserDefinedMedicineForm />
            </div>

        </>

    );
}

export default CreateUserDefinedMedicinePage;