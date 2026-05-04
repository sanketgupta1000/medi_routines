import { useParams } from "react-router";
import { useAppSelector } from "../../store/hooks";
import Header from "../ui/Header";
import { Link } from "react-router";
import type { DayOfWeek, TimeOfDay } from "../../services/routineService";

// Define types based on actual data structure
interface Medicine {
    id: string;
    name: string;
}

interface Schedule {
    day: DayOfWeek; // Use the specific DayOfWeek type
    times: TimeOfDay[]; // Use an array of the specific TimeOfDay type
}

interface RoutineMedicine {
    id: string;
    medicine: Medicine; // Assuming this is the detailed medicine object
    schedule: Schedule[];
    medicineId?: string; // This might be redundant if med.id is the routineMedicine's ID
}

interface TakenMedicine { // This type should come from your routine.takenMedicines
    date: string;
    day: DayOfWeek; // Use the specific DayOfWeek type
    time: TimeOfDay; // Use the specific TimeOfDay type
    routineMedicine: string; // ID of the RoutineMedicine
}

// Define type for our data grouping
interface TakenGroup {
    date: string;
    day: DayOfWeek; // Use the specific DayOfWeek type
    time: TimeOfDay; // Use the specific TimeOfDay type
    medicines: Record<string, boolean>; // Key is routineMedicineId
}

function RoutinePage() {
    const { routineIndex } = useParams<{ routineIndex: string }>();
    const routines = useAppSelector(state => state.routines.routines);
    
    // It's safer to parse routineIndex to a number and handle potential NaN
    const index = Number(routineIndex);
    const routine = (!isNaN(index) && index >= 0 && index < routines.length) ? routines[index] : undefined;

    if (!routine) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Routine not found</h2>
                <Link to="/routines" className="text-blue-600 hover:underline">Back to Routines</Link>
            </div>
        );
    }
    
    const takenByDateTime: Record<string, TakenGroup> = {};
    
    if (routine.takenMedicines && Array.isArray(routine.takenMedicines)) {
        // Ensure that routine.takenMedicines elements conform to the updated TakenMedicine type
        (routine.takenMedicines as TakenMedicine[]).forEach((taken) => {
            const key = `${taken.date}-${taken.day}-${taken.time}`; // Include day in key for uniqueness if needed
            if (!takenByDateTime[key]) {
                takenByDateTime[key] = {
                    date: taken.date,
                    day: taken.day, // Already DayOfWeek from TakenMedicine type
                    time: taken.time, // Already TimeOfDay from TakenMedicine type
                    medicines: {}
                };
            }
            
            if (taken.routineMedicine) {
                takenByDateTime[key].medicines[taken.routineMedicine] = true;
            }
        });
    }
    
    const takenGroups: TakenGroup[] = Object.values(takenByDateTime)
        .sort((a, b) => {
            if (a.date !== b.date) {
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateB.getTime() - dateA.getTime();
            }
            
            const timeOrder: Record<TimeOfDay, number> = { 
                "Morning": 0, 
                "Afternoon": 1, 
                "Evening": 2, 
                "Night": 3 
            };
            return (timeOrder[a.time] || 0) - (timeOrder[b.time] || 0);
        });

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">{routine.name}</h2>
            
            <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Medicines in this Routine</h3>
                <ul className="space-y-4">
                    {/* Ensure routine.medicines elements conform to RoutineMedicine type */}
                    {(routine.medicines as RoutineMedicine[])?.map((med) => (
                        <li key={med.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <strong className="text-lg text-blue-600">{med.medicine?.name || "Unknown medicine"}</strong>
                            <ul className="mt-2 ml-4 space-y-1">
                                {med.schedule?.map((sched, index) => (
                                    <li key={index} className="text-gray-700">
                                        <span className="font-medium">{sched.day}:</span> {sched.times.join(", ")}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mb-6">
                <h3 className="text-xl font-medium mb-4">Taken History</h3>
                {takenGroups.length === 0 ? (
                    <p className="text-gray-600 bg-gray-100 p-4 rounded-md text-center">No medicines have been taken yet.</p>
                ) : (
                    <div className="space-y-4">
                        {takenGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="border rounded-lg p-4 bg-white shadow-sm">
                                <h4 className="font-medium mb-2">{group.date} ({group.day}) - {group.time}</h4>
                                <ul className="space-y-2">
                                    {(routine.medicines as RoutineMedicine[])?.filter(med => {
                                            if (!med.schedule) return false;
                                            // Now group.day is DayOfWeek and group.time is TimeOfDay
                                            // And sched.day is DayOfWeek and sched.times is TimeOfDay[]
                                            // So the comparison sched.times.includes(group.time) is type-correct
                                            return med.schedule.some(sched => 
                                                sched.day === group.day && sched.times.includes(group.time)
                                            );
                                        })
                                        .map((med) => (
                                            <li key={med.id} className="flex items-center justify-between">
                                                <span>{med.medicine?.name || "Unknown medicine"}</span>
                                                {group.medicines[med.id] ? 
                                                    <span className="text-green-600 font-medium">✓ Taken</span> : 
                                                    <span className="text-red-500 font-medium">✗ Not Taken</span>
                                                }
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Link to="/routines" className="text-blue-600 hover:underline">
                Back to Routines
            </Link>
        </div>
    );
}

export default RoutinePage;