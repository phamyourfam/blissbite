import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

import {
	Container,
	Tabs,
	Burger,
	Group
} from '@mantine/core';

import classes from './HeaderTabs.module.css';
import { AccountMenu, EntryAuthModal, Logo, Searchbox } from '../components';
import { useAuth } from '../features/auth/hooks/useAuth';

export function Navbar() {
	const { t } = useTranslation('components');
	const [opened, { toggle }] = useDisclosure(false);
	const { isAuthenticated } = useAuth();

	// Wouter hooks
	const [location, setLocation] = useLocation();

	// Map tab names to their corresponding routes
	const tabRoutes = {
		feed: '/feed',
		orders: '/orders'
	};

	// Determine active tab based on current path
	const getActiveTab = () => {
		// For other routes, find the matching tab
		for (const [tab, path] of Object.entries(tabRoutes)) {
			if (path !== '/' && location.startsWith(path)) {
				return tab;
			}
		}

		// Default to Home if no match
		return 'Home';
	};

	// Handler for tab changes
	const handleTabChange = (value: keyof typeof tabRoutes) => {
		setLocation(tabRoutes[value]);
	};

	// Create tab items
	const items = Object.keys(tabRoutes).map((tab) => (
		<Tabs.Tab
			value={tab}
			key={tab}
		>
			{t(`navbar.${tab}`)}
		</Tabs.Tab>
	));

	return (
		<div className={classes.header}>
			<Container className={classes.mainSection}>
				<Group justify='space-between'>
					<Logo showLettermark />
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom='xs'
						size='sm'
					/>
					<Searchbox />
					{isAuthenticated ? <AccountMenu /> : <EntryAuthModal />}
				</Group>
			</Container>
			<Container size='md'>
				<Tabs
					value={getActiveTab()}
					onChange={handleTabChange}
					variant='outline'
					visibleFrom='sm'
					classNames={{
						root: classes.tabs,
						list: classes.tabsList,
						tab: classes.tab
					}}
				>
					<Tabs.List>{items}</Tabs.List>
				</Tabs>
			</Container>
		</div>
	);
}
