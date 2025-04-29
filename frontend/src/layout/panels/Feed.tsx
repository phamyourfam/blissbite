import { useState } from 'react';
import { Container, Title, LoadingOverlay, Text, Pagination } from '@mantine/core';
import { FeedCategoryBar } from '../../components/FeedCategoryBar';
import { FeedFilterBar } from '../../components/FeedFilterBar';
import { FeedPromotions } from '../../components/FeedPromotions';
import { FeedQuickPick } from '../../components/FeedQuickPick';
import { FeedRestaurantList } from '../../components/FeedRestaurantList';
import { IconPizza, IconBurger, IconShip, IconCoffee, IconSalad, IconMeat } from '@tabler/icons-react';
import { useLocation } from 'wouter';
import { useGetEstablishmentsQuery } from '../../features/establishments/establishmentsApi';

// Placeholder/mock data for non-establishment sections
const categories = [
	{ label: 'Pizza', icon: <IconPizza size={18} /> },
	{ label: 'Burgers', icon: <IconBurger size={18} /> },
	{ label: 'Sushi', icon: <IconShip size={18} /> },
	{ label: 'Breakfast', icon: <IconCoffee size={18} /> },
	{ label: 'Healthy', icon: <IconSalad size={18} /> },
	{ label: 'Grill', icon: <IconMeat size={18} /> },
];
const dietaryOptions = [
	{ label: 'Vegetarian', value: 'vegetarian' },
	{ label: 'Vegan', value: 'vegan' },
	{ label: 'Gluten-Free', value: 'gluten-free' },
];
const promotions = [
	{ id: '1', title: 'Spring Dine-in Specials!', description: 'Enjoy exclusive in-house offers this week only.' },
	{ id: '2', title: '2 for 1 Pizza', description: 'Buy one, get one free on all pizzas (dine-in only).' },
];
const quickPick = [
	{ id: 'a', name: 'Speedy Sushi', averagePrepTime: 10 },
	{ id: 'b', name: 'Burger Express', averagePrepTime: 8 },
];

export const Feed = () => {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [sort, setSort] = useState('highest-rated');
	const [dietary, setDietary] = useState<string[]>([]);
	const [availableNow, setAvailableNow] = useState(false);
	const [page, setPage] = useState(1);
	const limit = 9;
	const [, setLocation] = useLocation();

	const { data: response, isLoading } = useGetEstablishmentsQuery({ page, limit });
	const establishments = response?.establishments || [];

	const handleCardClick = (id: string) => {
		setLocation(`/establishments/${id}`);
	};

	return (
		<Container style={{ position: 'relative' }}>
			<Title order={2} mb="md">Find Your Next Meal</Title>
			{/* Category Bar */}
			<FeedCategoryBar
				categories={categories}
				selected={selectedCategory}
				onSelect={setSelectedCategory}
			/>
			{/* Filter Bar */}
			<FeedFilterBar
				sort={sort}
				onSortChange={setSort}
				dietary={dietary}
				onDietaryChange={setDietary}
				availableNow={availableNow}
				onAvailableNowChange={setAvailableNow}
				dietaryOptions={dietaryOptions}
			/>
			{/* Promotions/Banner */}
			<FeedPromotions promotions={promotions} />
			{/* Quick Pick */}
			<Text fw={700} size="lg" mb="xs">Featured</Text>
			{/* <FeedQuickPick establishments={quickPick} /> */}
			{/* Restaurant List */}
			<LoadingOverlay visible={isLoading} />
			<FeedRestaurantList
				restaurants={establishments.map(e => ({
					id: e.id,
					name: e.name,
					rating: 4.5, // TODO: Replace with real rating if available
					priceRange: '$$', // TODO: Replace with real price range if available
					availableServices: ['Dine-In', 'Pickup'], // TODO: Replace with real services if available
					specials: [], // TODO: Replace with real specials if available
					image: undefined // TODO: Replace with real image if available
				}))}
				onCardClick={handleCardClick}
			/>
			<Pagination 
				value={page} 
				onChange={setPage} 
				total={response?.pagination?.totalPages || 10} 
				mt="lg" 
			/>
		</Container>
	);
};
