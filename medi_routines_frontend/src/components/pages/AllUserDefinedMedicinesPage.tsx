import { useNavigate } from "react-router";
import { useAppSelector } from "../../store/hooks";
import Button from "../input/Button";
import SimpleLink from "../ui/SimpleLink";
import UserDefinedMedicine from "../ui/UserDefinedMedicine";

function AllUserDefinedMedicinesPage()
{
    const navigate = useNavigate();

    // Get user-defined medicines from Redux store (already fetched after login)
    const userDefinedMedicines = useAppSelector(state => state.userDefinedMedicines.userDefinedMedicines);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">

            <h2 className="text-2xl font-semibold mb-6">All User Defined Medicines</h2>

            {userDefinedMedicines.length === 0 ? (
                <div className="text-gray-600 bg-gray-100 p-4 rounded-md text-center mb-6">
                    No medicines found. Add your first medicine!
                </div>
            ) : (
                <ul className="mb-6 space-y-2 border rounded-lg divide-y">
                    {userDefinedMedicines.map((medicine) => (
                        <UserDefinedMedicine
                            key={medicine.id}
                            id={medicine.id}
                            name={medicine.name}
                        />
                    ))}
                </ul>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                <Button onClick={() => navigate("/medicines/create")} className="w-full sm:w-auto">
                    Create New Medicine
                </Button>

                <SimpleLink to="/routines" className="text-center w-full sm:w-auto">
                    View Your Routines
                </SimpleLink>
            </div>
        </div>
    );
}

export default AllUserDefinedMedicinesPage;