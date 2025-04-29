import { HelmetProvider } from 'react-helmet-async';
import { Route, Switch } from 'wouter';
import { AppShell, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ReduxProvider } from './app/Provider';
import { Notifications } from '@mantine/notifications';
import { ErrorBoundary } from './components';

import './i18n';
import { LandingPage } from './pages';
import { Navbar } from './layout';
import { ThemeProvider } from './theme';
import { NotificationTest } from './components/NotificationTest';
import { Settings } from './pages/Settings';
import { Establishments } from './pages/Establishments';
import { EstablishmentDetail } from './pages/EstablishmentDetail';
import EstablishmentProfile from './pages/EstablishmentProfile';
import { Feed } from './layout/panels/Feed';

const App = () => {
	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	return (
		<ReduxProvider>
			<HelmetProvider>
				<ThemeProvider>
					<Notifications position={isMobile ? 'top-center' : 'bottom-right'} zIndex={10000} />
					<ErrorBoundary>
					<Switch>
						<Route
							path='/'
							component={() => (
								<>
									{/* <NotificationTest /> */}
									<LandingPage />
								</>
							)}
						/>

						<AppShell
							header={{ height: 60 }}
							navbar={{
								width: 240,
								breakpoint: 'sm',
								collapsed: { mobile: true }
							}}		
						>
							<Navbar />
							<AppShell.Main>
								<Route path='/feed' component={Feed} />
								<Route path='/orders'>Orders</Route>
								<Route path='/settings' component={Settings} />
								<Route path='/establishments' component={Establishments} />
								<Route path='/establishments/:id/settings' component={EstablishmentDetail} />
								<Route path='/establishments/:id' component={EstablishmentProfile} />
							</AppShell.Main>
						</AppShell>
					</Switch>
					</ErrorBoundary>
				</ThemeProvider>
			</HelmetProvider>
		</ReduxProvider>
	);
};

export default App;
