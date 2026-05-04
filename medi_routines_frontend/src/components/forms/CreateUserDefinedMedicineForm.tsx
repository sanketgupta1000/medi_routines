import { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addUserDefinedMedicine } from "../../store/slices";
import userDefinedMedicineService, { type CreateUserDefinedMedicineRequest } from "../../services/userDefinedMedicineService";
import { handleErrorsAfterLogin } from "../../utils/errors/handlers";
import InputBox from "../input/InputBox";
import InputError from "../input/InputError";
import Button from "../input/Button";

type CreateUserDefinedMedicineData = Omit<CreateUserDefinedMedicineRequest, "token">;

function CreateUserDefinedMedicineForm()
{
    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateUserDefinedMedicineData>();

    // Loading state
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // Navigation and Redux
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.user.token);

    // Form submission handler
    const onSubmit: SubmitHandler<CreateUserDefinedMedicineData> = useCallback((data) => 
    {
        setSubmitLoading(true);

        userDefinedMedicineService
            .createUserDefinedMedicine(
                {
                    token: token!,
                    name: data.name
                }
            )
            .then((response) =>
                {
                    // Add to Redux store
                    dispatch(addUserDefinedMedicine({
                        userDefinedMedicine: response.userDefinedMedicine
                    }));

                    // Navigate back to medicines list
                    navigate("/medicines");
                }
            )
            .catch((err: Error) => {
                console.log(err);
                handleErrorsAfterLogin(err, navigate);
            })
            .finally(() => {
                setSubmitLoading(false);
            });
    }, [token, dispatch, navigate]);    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Medicine name field */}
            <InputBox
                type="text"
                label="Medicine Name"
                placeholder="Enter medicine name"
                {...register("name", { required: true })}
            />
            {errors.name && <InputError>Please enter a medicine name</InputError>}

            {/* Submit button */}
            <Button
                type="submit"
                loading={submitLoading}
                className="mt-4 w-full sm:w-auto"
            >
                {submitLoading ? "Adding..." : "Add Medicine"}
            </Button>
        </form>
    );
}

export default CreateUserDefinedMedicineForm;