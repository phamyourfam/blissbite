import { Autocomplete, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useGetProductsQuery } from '../features/establishments/establishmentsApi';

interface SearchboxProps {
	value: string;
	onSearch: (value: string) => void;
	filters?: Record<string, any>;
	onFiltersChange?: (filters: Record<string, any>) => void;
	establishmentId: string;
	[key: string]: any;
}

export const Searchbox = ({
	value,
	onSearch,
	filters, // not used here, but passed for future extensibility
	onFiltersChange, // not used here, but passed for future extensibility
	establishmentId,
	...props
}: SearchboxProps) => {
	const { t } = useTranslation('components');
	const [searchTerm, setSearchTerm] = useState(value);
	const [debounced, setDebounced] = useState(value);

	// Debounce search input
	useEffect(() => {
		const handler = setTimeout(() => setDebounced(searchTerm), 250);
		return () => clearTimeout(handler);
	}, [searchTerm]);

	// Fetch product suggestions from backend
	const { data: products = [], isLoading } = useGetProductsQuery(establishmentId, { skip: !establishmentId });

	// Filter suggestions by debounced search term
	const suggestions = products
		.filter((p) =>
			debounced.length === 0 ||
			p.name.toLowerCase().includes(debounced.toLowerCase())
		)
		.map((p) => p.name);

	return (
		<Autocomplete
			clearable
			data={suggestions}
			placeholder={t('searchbox.placeholder')}
			leftSection={
				isLoading ? (
					<Loader size={16} />
				) : (
					<IconSearch size={16} stroke={1.5} />
				)
			}
			value={searchTerm}
			onChange={(val) => {
				setSearchTerm(val);
				onSearch(val);
			}}
			{...props}
		/>
	);
};
