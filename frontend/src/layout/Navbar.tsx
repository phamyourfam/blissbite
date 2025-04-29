import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

import {
	Container,
	Tabs,
	Burger,
	Group,
	Button,
	Popover,
	NumberInput,
	Select,
	Switch,
	Stack,
	ActionIcon,
	Badge
} from '@mantine/core';

import classes from './HeaderTabs.module.css';
import { AccountMenu, EntryAuthModal, Logo, Searchbox, ShoppingCart } from '../components';
import { useAuth } from '../features/auth/hooks/useAuth';
import { IconFilter } from '@tabler/icons-react';

export function Navbar() {
	const { t } = useTranslation('components');
	const [opened, { toggle }] = useDisclosure(false);
	const { isAuthenticated, account } = useAuth();

	// Wouter hooks
	const [location, setLocation] = useLocation();

	// Map tab names to their corresponding routes
	const tabRoutes: Record<string, string> = {
		feed: '/feed',
		orders: '/orders'
	};

	// Add settings tab if user is authenticated
	if (isAuthenticated) {
		console.log('User is authenticated, account:', account);
		tabRoutes['settings'] = '/settings';
		
		// Add establishments tab if user is a professional account
		if (account?.accountType === 'PROFESSIONAL') {
			console.log('Adding establishments tab for professional account');
			tabRoutes['establishments'] = '/establishments';
		} else {
			console.log('Account type is not professional:', account?.accountType);
		}
	} else {
		console.log('User is not authenticated');
	}

	// Debug logging
	useEffect(() => {
		console.log('Auth State:', {
			isAuthenticated,
			accountType: account?.accountType,
			tabRoutes
		});
	}, [isAuthenticated, account?.accountType, tabRoutes]);

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
	const handleTabChange = (value: string | null) => {
		if (value === null) return;
		if (value in tabRoutes) {
			setLocation(tabRoutes[value]);
		}
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

	// Filter state
	const [filters, setFilters] = useState({
		minPrice: '',
		maxPrice: '',
		category: '',
		availableOnly: false,
		sortBy: 'price',
		order: 'asc',
	});
	const [search, setSearch] = useState('');
	const [filtersPopoverOpen, setFiltersPopoverOpen] = useState(false);

	// Example categories (replace with API data if available)
	const categories = [
		{ label: 'Pizza', value: 'pizza' },
		{ label: 'Burgers', value: 'burgers' },
		{ label: 'Sushi', value: 'sushi' },
		{ label: 'Breakfast', value: 'breakfast' },
		{ label: 'Healthy', value: 'healthy' },
		{ label: 'Grill', value: 'grill' },
	];

	const sortOptions = [
		{ label: 'Price', value: 'price' },
		{ label: 'Rating', value: 'rating' },
		{ label: 'Popularity', value: 'popularity' },
	];

	const orderOptions = [
		{ label: 'Ascending', value: 'asc' },
		{ label: 'Descending', value: 'desc' },
	];

	const handleFilterChange = (field: string, value: any) => {
		setFilters((prev) => ({ ...prev, [field]: value }));
	};

	const handleApplyFilters = () => {
		setFiltersPopoverOpen(false);
		// Optionally trigger search here
	};

	const anyFiltersActive = Object.entries(filters).some(
		([key, value]) =>
			(key === 'availableOnly' ? value : value !== '' && value !== undefined && value !== null && value !== 'asc')
	);

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
					<Group>
						<Searchbox
							value={search}
							onSearch={setSearch}
							filters={filters}
						/>
						<Popover
							opened={filtersPopoverOpen}
							onChange={setFiltersPopoverOpen}
							position="bottom"
							withArrow
							shadow="md"
						>
							<Popover.Target>
								<ActionIcon
									variant={anyFiltersActive ? 'filled' : 'outline'}
									color={anyFiltersActive ? 'blue' : 'gray'}
									onClick={() => setFiltersPopoverOpen((o) => !o)}
									size="lg"
									radius="md"
									style={{ border: anyFiltersActive ? '2px solid var(--mantine-color-blue-5)' : undefined }}
								>
									<IconFilter size={20} />
									{anyFiltersActive && <Badge color="blue" size="xs" style={{ position: 'absolute', top: 2, right: 2 }}>!</Badge>}
								</ActionIcon>
							</Popover.Target>
							<Popover.Dropdown>
								<Stack gap="xs" w={260}>
									<NumberInput
										label="Min Price"
										value={filters.minPrice}
										onChange={(val) => handleFilterChange('minPrice', val)}
										min={0}
										step={1}
									/>
									<NumberInput
										label="Max Price"
										value={filters.maxPrice}
										onChange={(val) => handleFilterChange('maxPrice', val)}
										min={0}
										step={1}
									/>
									<Select
										label="Category"
										data={categories}
										value={filters.category}
										onChange={(val) => handleFilterChange('category', val)}
										clearable
									/>
									<Switch
										label="Available Only"
										checked={filters.availableOnly}
										onChange={(event) => handleFilterChange('availableOnly', event.currentTarget.checked)}
									/>
									<Select
										label="Sort By"
										data={sortOptions}
										value={filters.sortBy}
										onChange={(val) => handleFilterChange('sortBy', val)}
									/>
									<Select
										label="Order"
										data={orderOptions}
										value={filters.order}
										onChange={(val) => handleFilterChange('order', val)}
									/>
									<Button mt="sm" onClick={handleApplyFilters} fullWidth>
										Apply Filters
									</Button>
								</Stack>
							</Popover.Dropdown>
						</Popover>
					</Group>
					<Group gap="xs">
						<ShoppingCart />
						{isAuthenticated ? <AccountMenu /> : <EntryAuthModal />}
					</Group>
				</Group>
			</Container>
			<Container>
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
