import { Route, Switch } from 'wouter';
import { AuthRoute } from '../features/auth/components/AuthRoute';
import { EntryAuthModal } from '../features/auth/EntryAuthModal';
import { Dashboard } from '../features/dashboard/Dashboard';
import { Settings } from '../features/settings/Settings';

export const AppRoutes = () => {
    return (
        <Switch>
            {/* Public routes */}
            <Route path="/login">
                <AuthRoute requireAuth={false} redirectTo="/dashboard">
                    <EntryAuthModal />
                </AuthRoute>
            </Route>

            {/* Protected routes */}
            <Route path="/dashboard">
                <AuthRoute>
                    <Dashboard />
                </AuthRoute>
            </Route>

            <Route path="/settings">
                <AuthRoute>
                    <Settings />
                </AuthRoute>
            </Route>

            {/* Catch all route */}
            <Route>
                <AuthRoute>
                    <Dashboard />
                </AuthRoute>
            </Route>
        </Switch>
    );
}; 