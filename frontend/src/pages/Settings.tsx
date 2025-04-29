import { Container, Title, Tabs, Card, Text, Group, Button, Select, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AccountSettings } from '../features/account/components/AccountSettings';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useLocation } from 'wouter';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccountType, selectAuthError } from '../features/auth/authSlice';

export function Settings() {
	const { t } = useTranslation(['pages', 'common']);
	const { account } = useAuth();
	const [, setLocation] = useLocation();
	const dispatch = useDispatch();
	const error = useSelector(selectAuthError);

	const handleAccountTypeChange = (value: string | null) => {
		if (value === 'PERSONAL' || value === 'PROFESSIONAL') {
			dispatch(updateAccountType(value));
		}
	};

	return (
		<Container>
			<Group mb="md" align="center">
				<Button
					variant="subtle"
					leftSection={<IconArrowLeft size={14} />}
					onClick={() => setLocation('/')}
					size="sm"
				>
					{t('common.back')}
				</Button>
				<Title order={2}>{t('settings.title')}</Title>
			</Group>
			
			<Tabs defaultValue="account">
				<Tabs.List>
					<Tabs.Tab value="account">{t('settings.tabs.account')}</Tabs.Tab>
					<Tabs.Tab value="notifications">{t('settings.tabs.notifications')}</Tabs.Tab>
					<Tabs.Tab value="security">{t('settings.tabs.security')}</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="account" pt="md">
					{/* <Card withBorder>
						<Text size="lg" fw={500} mb="md">{t('settings.accountType', 'Account Type')}</Text>
						
						{error && (
							<Alert 
								icon={<IconAlertCircle size={16} />} 
								title={t('common:error')} 
								color="red"
								mb="md"
							>
								{error}
							</Alert>
						)}

						<Group>
							<Select
								label={t('settings.accountType', 'Account Type')}
								value={account?.accountType}
								onChange={handleAccountTypeChange}
								data={[
									{ value: 'PERSONAL', label: t('settings.personalAccount', 'Personal Account') },
									{ value: 'PROFESSIONAL', label: t('settings.professionalAccount', 'Professional Account') }
								]}
								disabled={!account}
							/>
						</Group>

						<Text size="sm" c="dimmed" mt="md">
							{account?.accountType === 'PROFESSIONAL' 
								? t('settings.professionalAccountDescription', 'Professional accounts can create and manage establishments.')
								: t('settings.personalAccountDescription', 'Personal accounts are for individual users.')}
						</Text>
					</Card> */}
					<AccountSettings account={account} />
				</Tabs.Panel>

				<Tabs.Panel value="notifications" pt="md">
					<Card withBorder>
						<Text>Notification settings coming soon...</Text>
					</Card>
				</Tabs.Panel>

				<Tabs.Panel value="security" pt="md">
					<Card withBorder>
						<Text>Security settings coming soon...</Text>
					</Card>
				</Tabs.Panel>
			</Tabs>
		</Container>
	);
} 