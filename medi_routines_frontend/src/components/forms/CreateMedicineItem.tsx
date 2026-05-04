import { useFieldArray, Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { DayOfWeek, TimeOfDay, CreateRoutineRequest } from "../../services/routineService";
import SelectInput from "../input/SelectInput";
import Checkbox from "../input/Checkbox";
import Button from "../input/Button";
import InputError from "../input/InputError";
import { useRef } from "react";

interface CreateMedicineItemProps {
    medicineIndex: number;
    control: Control<CreateRoutineRequest>;
    register: UseFormRegister<CreateRoutineRequest>;
    errors: FieldErrors<CreateRoutineRequest>;
    days: DayOfWeek[];
    times: TimeOfDay[];
}

function CreateMedicineItem({
    medicineIndex,
    control,
    register,
    errors,
    days,
    times
}: CreateMedicineItemProps) {
    const checkboxRef = useRef<HTMLInputElement>(null); // Each item can have its own ref if needed, or manage locally

    const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
        control,
        name: `medicines.${medicineIndex}.schedule`
    });

    return (
        <div className="mt-4">
            <h5 className="font-medium mb-3">Schedule</h5>
            
            {scheduleFields.map((scheduleField, scheduleIndex) => (
                <div key={scheduleField.id} className="border-t pt-4 mb-4">
                    <h6 className="text-sm font-medium mb-2">Schedule {scheduleIndex + 1}</h6>
                    
                    {/* Day selection */}
                    <SelectInput
                        label="Day"
                        options={days.map(day => ({ value: day, label: day }))}
                        {...register(`medicines.${medicineIndex}.schedule.${scheduleIndex}.day`, { required: "Day is required" })}
                    />
                    {errors.medicines?.[medicineIndex]?.schedule?.[scheduleIndex]?.day && (
                        <InputError>{errors.medicines[medicineIndex]?.schedule?.[scheduleIndex]?.day?.message}</InputError>
                    )}
                    
                    {/* Time selection (checkboxes) */}
                    <div className="mb-4">
                        <p className="block mb-1 text-sm font-medium text-gray-700">Times</p>
                        <div className="grid grid-cols-2 gap-2">
                            {times.map(time => (
                                <div key={time}>
                                    <Controller
                                        name={`medicines.${medicineIndex}.schedule.${scheduleIndex}.times`}
                                        control={control}
                                        rules={{ 
                                            required: "Please select at least one time", 
                                            validate: selectedTimes => (selectedTimes && selectedTimes.length > 0) || "Please select at least one time"
                                        }}
                                        render={({ field }) => (
                                            <Checkbox
                                                ref={checkboxRef} // This ref might need careful handling if used for external interactions
                                                label={time}
                                                onChange={e => {
                                                    const checked = e.target.checked;
                                                    const currentTimes = field.value || [];
                                                    
                                                    if (checked && !currentTimes.includes(time)) {
                                                        field.onChange([...currentTimes, time]);
                                                    } else if (!checked && currentTimes.includes(time)) {
                                                        field.onChange(currentTimes.filter(t => t !== time));
                                                    }
                                                }}
                                                checked={(field.value || []).includes(time)}
                                            />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        {errors.medicines?.[medicineIndex]?.schedule?.[scheduleIndex]?.times && 
                            <InputError>{errors.medicines[medicineIndex]?.schedule?.[scheduleIndex]?.times?.message}</InputError>
                        }
                    </div>
                    {/* Remove schedule button */}
                    {scheduleFields.length > 1 && (
                        <Button
                            type="button"
                            onClick={() => removeSchedule(scheduleIndex)}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white"
                        >
                            Remove Schedule
                        </Button>
                    )}
                </div>
            ))}
            
            {/* Add schedule button */}
            <Button
                type="button"
                onClick={() => appendSchedule({ day: "Monday", times: [] })}
                className="mt-2 bg-gray-600 hover:bg-gray-700 text-white"
            >
                Add Schedule
            </Button>
        </div>
    );
}

export default CreateMedicineItem;