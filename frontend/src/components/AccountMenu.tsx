import React, { useState } from 'react';
import {
	Menu,
	UnstyledButton,
	Group,
	Avatar,
	Text,
	useMantineTheme,
	Modal,
	TextInput,
	Button,
	Stack,
	Alert
} from '@mantine/core';
import {
	IconChevronDown,
	IconHeart,
	IconMessage,
	IconSettings,
	IconLogout,
	IconTrash,
	IconAlertCircle
} from '@tabler/icons-react';
import cx from 'clsx';
import { ColorSchemeToggle, LanguageDropdown } from '../components';
import classes from './AccountMenu.module.css';
import { useTranslation } from 'react-i18next';
import { useLogoutMutation, useDeleteAccountMutation } from '../services/authApi';
import { useLocation } from 'wouter';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useAuth } from '../features/auth/hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';

export const AccountMenu = () => {
	const theme = useMantineTheme();
	const [userMenuOpened, setUserMenuOpened] = useState(false);
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const { t } = useTranslation('components');
	const [logoutMutation] = useLogoutMutation();
	const [deleteAccountMutation] = useDeleteAccountMutation();
	const [location, setLocation] = useLocation();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { account } = useAuth();
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			email: ''
		},
		validate: {
			email: (value) => (value === account?.email ? null : 'Email does not match')
		}
	});

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

	const handleSettingsClick = () => {
		setLocation('/settings');
		setUserMenuOpened(false);
	};

	const handleDeleteAccount = async () => {
		if (!account) return;

		try {
			await deleteAccountMutation({ accountId: account.id }).unwrap();
			notifications.show({
				title: t('navbar.menu.accountDeleted'),
				message: t('navbar.menu.accountDeletedMessage'),
				color: 'green'
			});
			setDeleteModalOpened(false);
			setLocation('/');
		} catch (error: any) {
			setDeleteError(error.data?.message || error.message || 'Failed to delete account');
		}
	};

	return (
		<>
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
						onClick={handleSettingsClick}
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
						onClick={() => setDeleteModalOpened(true)}
					>
						{t('navbar.menu.deleteAccount')}
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>

			<Modal
				opened={deleteModalOpened}
				onClose={() => {
					setDeleteModalOpened(false);
					setDeleteError(null);
					form.reset();
				}}
				title={t('navbar.menu.deleteAccount')}
				centered
			>
				<form onSubmit={form.onSubmit(handleDeleteAccount)}>
					<Stack>
						<Text size="sm" c="dimmed">
							{t('navbar.menu.deleteAccountWarning')}
						</Text>
						<TextInput
							label={t('navbar.menu.confirmEmail')}
							placeholder={account?.email}
							{...form.getInputProps('email')}
						/>
						{deleteError && (
							<Alert
								icon={<IconAlertCircle size={16} />}
								title={t('common.error')}
								color="red"
							>
								{deleteError}
							</Alert>
						)}
						<Group justify="flex-end" mt="md">
							<Button variant="default" onClick={() => setDeleteModalOpened(false)}>
								{t('navbar.menu.cancel')}
							</Button>
							<Button
								type="submit"
								color="red"
								disabled={!form.isValid()}
							>
								{t('navbar.menu.deleteAccount')}
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
