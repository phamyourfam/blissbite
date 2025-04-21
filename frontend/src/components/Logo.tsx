import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Group, Image, Text } from '@mantine/core';

interface LogoProps {
	showLettermark?: boolean;
}

export const Logo = ({ showLettermark = false }: LogoProps) => {
	const { t } = useTranslation('common');

	return (
		<Link
			href='/'
			style={{
				color: 'inherit',
				fontFamily: 'Clash Display',
				textDecoration: 'none'
			}}
		>
			<Group gap='0.5rem'>
				<Image
					src='./favicon/favicon.svg'
					alt={t('app.name') + ' logo.'}
					style={{ width: 20, height: 20 }}
				/>
				{showLettermark && (
					<Text>
						<strong>{t('app.name')}</strong>
					</Text>
				)}
			</Group>
		</Link>
	);
};
