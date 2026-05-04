import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices";
import { NavLink } from "react-router";
import Button from "../input/Button";

function Header()
{
    const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
    const dispatch = useAppDispatch();

    const handleLogout = useCallback( () => {
        dispatch(logout());
    }, [dispatch]);    return (
        <nav className="bg-white shadow-sm p-4 mb-6">
            <ul className="flex flex-wrap items-center gap-4 md:gap-6">
                {!isLoggedIn && (
                    <>
                        <li>
                            <NavLink
                                to="/auth/signup"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                    Signup
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/auth/login"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                Login
                            </NavLink>
                        </li>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <li>
                            <NavLink
                                to="/routines/upcoming"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                Upcoming Routines
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/routines"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                All Routines
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/routines/create"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                Create Routine
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/medicines/create"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                Create Medicine
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/medicines"
                                end
                                className={({isActive}) => isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}>
                                All Medicines
                            </NavLink>
                        </li>
                        <li className="ml-auto">
                            <Button
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Header;