import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export const LanguageDropdown = (props) => {
	const { i18n } = useTranslation('pages');
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLSelectElement>(null);

	const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
		selectRef.current?.blur();

		const selectedLanguage = event.target.value;
		i18n.changeLanguage(selectedLanguage).then(() => {
			document.title = i18n.t('app.name');
		});
	};

	return (
		<Input
			component='select'
			ref={selectRef}
			onChange={onChangeLanguage}
			value={i18n.language}
			onFocus={() => setIsOpen(true)}
			onBlur={() => setIsOpen(false)}
			rightSection={
				isOpen ? (
					<IconChevronUp
						size={14}
						stroke={1.5}
					/>
				) : (
					<IconChevronDown
						size={14}
						stroke={1.5}
					/>
				)
			}
			pointer
			style={props.style}
		>
			<option value='en'>EN</option>
			<option value='zh'>中文</option>
		</Input>
	);
};
