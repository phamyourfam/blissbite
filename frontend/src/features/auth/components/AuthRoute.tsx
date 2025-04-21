import { useEffect } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../authSlice';

interface AuthRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * AuthRoute Component
 * 
 * A middleware component that handles authentication and route protection using Wouter.
 * Can be used to protect routes that require authentication or redirect
 * authenticated users away from auth pages.
 * 
 * @param children - The route component to render
 * @param requireAuth - Whether the route requires authentication (default: true)
 * @param redirectTo - Where to redirect if auth requirements aren't met (default: '/login')
 */
export const AuthRoute = ({
    children,
    requireAuth = true,
    redirectTo = '/login'
}: AuthRouteProps) => {
    const [location, setLocation] = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser);

    useEffect(() => {
        // If auth is required but no user is logged in
        if (requireAuth && !user) {
            // Store the attempted URL for redirect after login
            sessionStorage.setItem('redirectAfterLogin', location);
            navigate(redirectTo);
        }
        // If auth is not required but user is logged in
        else if (!requireAuth && user) {
            // Redirect to home or specified path
            navigate(redirectTo);
        }
    }, [user, requireAuth, navigate, location, redirectTo]);

    // Show loading state while checking auth
    if (requireAuth && !user) {
        return null; // or a loading spinner
    }

    // If we get here, either:
    // 1. Auth is required and user is logged in
    // 2. Auth is not required and user is not logged in
    return <>{children}</>;
}; 