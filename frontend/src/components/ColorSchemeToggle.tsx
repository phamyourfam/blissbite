import { ActionIcon } from '@mantine/core';
import { createContext, useContext } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useLocalStorage, useWindowEvent } from '@mantine/hooks';

import { useTheme } from '../theme';

export const ColorSchemeToggle = (props) => {
	const theme = useTheme();

	return (
		<ActionIcon
			variant='outline'
			color={theme.colorScheme === 'dark' ? 'yellow' : 'blue'}
			onClick={() => theme.toggleColorScheme()}
			title='Toggle color scheme'
			{...props}
		>
			{theme.colorScheme === 'dark' ? (
				<IconSun style={{ width: 18, height: 18 }} />
			) : (
				<IconMoon style={{ width: 18, height: 18 }} />
			)}
		</ActionIcon>
	);
};
