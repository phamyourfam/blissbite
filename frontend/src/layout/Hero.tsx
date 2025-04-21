import classes from './Hero.module.css';

import React from 'react';
import { Link } from 'wouter';
import { Trans, useTranslation } from 'react-i18next';
import {
	IconBolt,
	IconChevronDown,
	IconDashboard,
	IconStar,
	IconToolsKitchen2
} from '@tabler/icons-react';
import {
	Box,
	Button,
	Card,
	Container,
	Grid,
	Group,
	Image,
	Input,
	Stack,
	Text,
	ThemeIcon,
	Title,
	rgba
} from '@mantine/core';

import { Logo } from '../components';

export const Hero = () => {
	const { i18n, t } = useTranslation(['pages', 'common']);

	const onChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedLanguage = event.target.value;

		console.log(selectedLanguage);
		i18n.changeLanguage(selectedLanguage);
	};

	const features = [
		{ icon: <IconBolt />, key: 'fast', label: 'lightning fast' },
		{ icon: <IconStar />, key: 'ready', label: 'production ready' },
		{ icon: <IconDashboard />, key: 'modern', label: 'modern design' }
	];

	return (
		<Box>
			<Container
				size='90vw'
				py={40}
			>
				<Grid
					gutter={30}
					align='center'
				>
					<Grid.Col span={{ base: 12, md: 7 }}>
						<Stack gap='xl'>
							<Group gap={'xs'}>
								<Logo />
								<Text
									fw={500}
									size='sm'
									style={{ letterSpacing: 1 }}
								>
									{t('landing.hero.launch', 'LAUNCH YOUR RESTAURANT TODAY')}
								</Text>
							</Group>

							<Title
								className={classes?.gradientText + ' ' + classes?.breakText}
								order={1}
								size='h1'
							>
								{
									t('landing.hero.title', {
										brand: t('common:app.name')
									})
										.split('!')
										.reduce<React.ReactNode[]>(
											(acc, part, i) =>
												acc.concat(i ? ['!', <br key={`break-${i}`} />, part] : [part]),
											[]
										) // Add line break after exclamation mark.
								}
							</Title>

							<Text
								size='xl'
								c='dimmed'
								maw={600}
							>
								{t(
									'landing.hero.description',
									'transforming dine-in experiences with real-time order tracking and a seamless front-to-kitchen integrated point-of-sale system'
								)}
							</Text>

							<Group mt='xl'>
								<Link href='/feed'>
									<Button
										size='lg'
										leftSection={<IconToolsKitchen2 />}
									>
										{t('landing.hero.explore', 'explore food & drink')}
									</Button>
								</Link>
								<Button
									size='lg'
									variant='default'
								>
									{t('landing.hero.learn', 'learn more')}
								</Button>
								<Input
									component='select'
									onChange={onChangeLanguage}
									value={i18n.language}
									rightSection={
										<IconChevronDown
											size={14}
											stroke={1.5}
										/>
									}
									pointer
									mt='md'
								>
									<option value='en'>EN</option>
									<option value='zh'>中文</option>
								</Input>
							</Group>

							<Group
								mt={30}
								gap='xl'
							>
								{features.map((feature) => (
									<Group
										key={feature.label}
										gap='xs'
									>
										<ThemeIcon
											size='md'
											variant='light'
											color='#4c61a3'
											style={{
												background: rgba(
													'var(--mantine-primary-color-filled)',
													0.07
												)
											}}
										>
											{feature.icon}
										</ThemeIcon>
										<Text
											size='sm'
											c='dimmed'
										>
											{t('landing.hero.features.' + feature.key, feature.label)}
										</Text>
									</Group>
								))}
							</Group>
						</Stack>
					</Grid.Col>

					<Grid.Col
						span={{ base: 12, md: 5 }}
						style={{ position: 'relative' }}
					>
						<Card
							shadow='sm'
							padding='lg'
							radius='md'
							withBorder
							style={{ position: 'absolute', top: 0, right: 0 }}
						>
							<Card.Section>
								<Stack p='10'>
									<Text
										size='xs'
										style={{ whiteSpace: 'pre-line' }}
									>
										<span
											style={{
												fontFamily: 'Clash Display',
												fontSize: '1.1rem'
											}}
										>
											<b>#28</b>
										</span>
										<br />
										<span style={{ display: 'block', maxWidth: '9ch' }}>
											<Trans
												t={t}
												i18nKey='landing.hero.order_ready'
												components={{ bold: <strong /> }}
											></Trans>
										</span>
									</Text>
								</Stack>
							</Card.Section>
						</Card>
						<Card
							shadow='sm'
							padding='lg'
							radius='md'
							withBorder
							style={{ position: 'absolute', bottom: 0, left: 0 }}
						>
							<Card.Section>
								<Group p='10'>
									<Image
										src='https://www.ohhowcivilized.com/wp-content/uploads/matcha-green-tea-latte-recipe.jpg'
										height={50}
										alt='Matcha latte.'
										radius='md'
									/>
									<Text style={{ whiteSpace: 'pre-line' }}>
										<Trans
											t={t}
											i18nKey='landing.hero.order_placed'
											components={{ bold: <strong /> }}
										>
											<strong>Chae-won</strong>
											<br /> has ordered a matcha latte
										</Trans>
									</Text>
								</Group>
							</Card.Section>
						</Card>
						<Image
							src='https://pbs.twimg.com/media/FsRXpoyaQAA3CQb.jpg:large'
							alt='hero'
							radius='md'
							height={450}
						/>
					</Grid.Col>
				</Grid>
			</Container>
		</Box>
	);
};
