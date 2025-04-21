import { Autocomplete } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { IconSearch } from '@tabler/icons-react';

export const Searchbox = (props) => {
	const { t } = useTranslation('components');

	return (
		<Autocomplete
			clearable
			data={['React', 'Angular']}
			placeholder={t('searchbox.placeholder')}
			leftSection={
				<IconSearch
					size={16}
					stroke={1.5}
				/>
			}
			{...props}
		/>
	);
};
