import React, { useState } from 'react';
import {
	Menu,
	UnstyledButton,
	Group,
	Avatar,
	Text,
	useMantineTheme
} from '@mantine/core';
import {
	IconChevronDown,
	IconHeart,
	IconMessage,
	IconSettings,
	IconLogout,
	IconTrash
} from '@tabler/icons-react';
import cx from 'clsx';
import { ColorSchemeToggle, LanguageDropdown } from '../components';
import classes from './AccountMenu.module.css';
import { useTranslation } from 'react-i18next';
import { useLogoutMutation } from '../services/authApi';
import { useLocation } from 'wouter';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';

export const AccountMenu = () => {
	const theme = useMantineTheme();
	const [userMenuOpened, setUserMenuOpened] = useState(false);
	const { t } = useTranslation('components');
	const [logoutMutation] = useLogoutMutation();
	const [location, setLocation] = useLocation();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const handleLogout = async () => {
		try {
			await logoutMutation().unwrap();
			// Only redirect if we're on a restricted page
			if (location.startsWith('/account') || location.startsWith('/orders')) {
				setLocation('/');
			}
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<Menu
			width={260}
			position='bottom-end'
			transitionProps={{ transition: 'pop-top-right' }}
			onClose={() => setUserMenuOpened(false)}
			onOpen={() => setUserMenuOpened(true)}
			withinPortal
		>
			<Menu.Target>
				<UnstyledButton
					className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
				>
					<Group gap={7}>
						<Avatar
							// src={user.image}
							// alt={user.name}
							radius='xl'
							size={20}
						/>
						<Text
							fw={500}
							size='sm'
							lh={1}
							mr={3}
						>
							{/* {user.name} */}
						</Text>
						<IconChevronDown
							size={12}
							stroke={1.5}
						/>
					</Group>
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					leftSection={
						<IconHeart
							size={16}
							color={theme.colors.red[6]}
							stroke={1.5}
						/>
					}
				>
					{t('navbar.menu.liked')}
				</Menu.Item>
				<Menu.Item
					leftSection={
						<IconMessage
							size={16}
							color={theme.colors.blue[6]}
							stroke={1.5}
						/>
					}
				>
					{t('navbar.menu.reviews')}
				</Menu.Item>
				<Menu.Label>{t('navbar.menu.settings')}</Menu.Label>
				<Menu.Item
					leftSection={
						<IconSettings
							size={16}
							stroke={1.5}
						/>
					}
				>
					{t('navbar.menu.settings')}
				</Menu.Item>
				<Menu.Item
					leftSection={
						<IconLogout
							size={16}
							stroke={1.5}
						/>
					}
					onClick={handleLogout}
				>
					{t('navbar.menu.logout')}
				</Menu.Item>
				<Menu.Label>
					<Group align='stretch'>
						<ColorSchemeToggle
							ref={(el: HTMLDivElement | null) =>
								el && (el.style.width = `${el.clientHeight}px`)
							}
							style={{
								aspectRatio: '1 / 1',
								height: 'inherit'
							}}
						/>
						<LanguageDropdown style={{ flexGrow: 1 }} />
					</Group>
				</Menu.Label>
				<Menu.Divider />
				<Menu.Label>{t('navbar.menu.danger')}</Menu.Label>
				<Menu.Item
					color='red'
					leftSection={
						<IconTrash
							size={16}
							stroke={1.5}
						/>
					}
				>
					{t('navbar.menu.delete')}
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};
