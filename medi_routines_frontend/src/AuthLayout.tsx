import { useEffect, useState } from "react";
import { useAppSelector } from "./store/hooks";
import { Outlet, useNavigate } from "react-router";

interface AuthLayoutProps
{
    authRequired: boolean;
}

// component to wrap every page
// will be useful to check auth before user can access the page
function AuthLayout({ authRequired }: AuthLayoutProps)
{
    const { isLoggedIn } = useAppSelector(state => state.user);
    
    // To display loading till user is getting checked
    const [isLoading, setLoading] = useState<boolean>(true);
    
    // Navigate for redirecting
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        
        if (authRequired && !isLoggedIn) {
            // Auth required but not logged in, redirect to login
            navigate("/auth/login");
        } else if (!authRequired && isLoggedIn) {
            // Auth not required, but logged in
            // Redirect to upcoming routines page (landing page after login)
            navigate("/routines/upcoming");
        }
        
        // Set loading to false
        setLoading(false);
    }, [isLoggedIn, authRequired, navigate]);
    
    return (
        isLoading ? (
            <div>Loading...</div>
        ) : (
            <Outlet/>
        )
    );
}

export default AuthLayout;