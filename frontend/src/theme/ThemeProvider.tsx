import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react';
import {
	createTheme,
	MantineColorScheme,
	MantineProvider,
	mergeThemeOverrides,
	useMantineColorScheme
} from '@mantine/core';

import { shadcnTheme, shadcnCssVariableResolver } from '.';

// Define the theme context type
type ThemeContextType = {
	colorScheme: MantineColorScheme;
	toggleColorScheme: () => void;
	setColorScheme: (scheme: MantineColorScheme) => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
	colorScheme: 'light',
	toggleColorScheme: () => {},
	setColorScheme: () => {}
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Props type for the provider component
type ThemeProviderProps = {
	children: ReactNode;
};

// Helper function to detect system preference
const getSystemPreference = (): MantineColorScheme => {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
};

// The component that manages theme state and preference
const ThemeStateManager = ({ children }: ThemeProviderProps) => {
	const {
		colorScheme,
		toggleColorScheme: toggleMantineColorScheme,
		setColorScheme: setMantineColorScheme
	} = useMantineColorScheme();
	const [mounted, setMounted] = useState(false);

	// Handle the color scheme toggle
	const toggleColorScheme = () => {
		const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
		setMantineColorScheme(newScheme);
		localStorage.setItem('theme', newScheme);
	};

	// Explicit setter for color scheme
	const setColorScheme = (scheme: MantineColorScheme) => {
		setMantineColorScheme(scheme);
		localStorage.setItem('theme', scheme);
	};

	// Initialize theme on component mount
	useEffect(() => {
		// First check localStorage for user preference
		const savedTheme = localStorage.getItem('theme');

		if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
			// Use saved user preference
			setMantineColorScheme(savedTheme as MantineColorScheme);
		} else {
			// Fall back to system preference if no user setting exists
			const systemPreference = getSystemPreference();
			setMantineColorScheme(systemPreference);
		}

		// Add listener for system preference changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			// Only update if user hasn't set a preference
			if (!localStorage.getItem('theme')) {
				setMantineColorScheme(e.matches ? 'dark' : 'light');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		setMounted(true);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [setMantineColorScheme]);

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return <>{children}</>;
	}

	return (
		<ThemeContext.Provider
			value={{
				colorScheme,
				toggleColorScheme,
				setColorScheme
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

// The main exported ThemeProvider that composes the Mantine provider with our theme state
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const themeOverride = createTheme({
		fontFamily: "'Archivo', sans-serif",
		headings: { fontFamily: "'Clash Display', sans-serif" }
	});

	return (
		<MantineProvider
			theme={mergeThemeOverrides(shadcnTheme, themeOverride)}
			cssVariablesResolver={shadcnCssVariableResolver}
		>
			<ThemeStateManager>{children}</ThemeStateManager>
		</MantineProvider>
	);
};
