import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Card,
	Text,
	TextInput,
	Select,
	Button,
	Group,
	Stack,
	LoadingOverlay,
	Notification,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUpdateAccountMutation } from '../accountApi';
import type { Account } from '../../auth/types';

interface AccountSettingsProps {
	account: Account | null;
}

export function AccountSettings({ account }: AccountSettingsProps) {
	const { t } = useTranslation('account');
	const [updateAccount, { isLoading, isSuccess, isError }] = useUpdateAccountMutation();
	const [showSuccess, setShowSuccess] = useState(false);

	const form = useForm({
		initialValues: {
			forename: '',
			surname: '',
			accountType: account?.accountType || 'PERSONAL',
		},
		validate: {
			forename: (value: string) => (value && value.length < 2 ? t('validation.forename') : null),
			surname: (value: string) => (value && value.length < 2 ? t('validation.surname') : null),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		if (!account) return;

		// Only include fields that have values in the update request
		const updateData: Record<string, any> = {
			accountId: account.id,
		};
		
		if (values.forename.trim()) updateData.forename = values.forename;
		if (values.surname.trim()) updateData.surname = values.surname;
		if (values.accountType) updateData.accountType = values.accountType;
		
		try {
			console.log('Attempting to update account with data:', updateData);
			await updateAccount(updateData).unwrap();
			setShowSuccess(true);
			setTimeout(() => setShowSuccess(false), 3000);
		} catch (error: any) {
			console.error('Failed to update account:', {
				error,
				status: error.status,
				data: error.data,
				message: error.message,
				stack: error.stack
			});
			// Re-throw to ensure the error UI is shown
			throw error;
		}
	};

	if (!account) {
		return (
			<Card withBorder>
				<Text>{t('notLoggedIn')}</Text>
			</Card>
		);
	}

	return (
		<Card withBorder>
			<LoadingOverlay visible={isLoading} />
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="md">
					{showSuccess && (
						<Notification
							color="green"
							title={t('updateSuccess')}
							onClose={() => setShowSuccess(false)}
						>
							{t('accountUpdated')}
						</Notification>
					)}

					{isError && (
						<Notification color="red" title={t('updateError')}>
							{t('updateFailed')}
						</Notification>
					)}

					<TextInput
						label={t('forename')}
						placeholder={account.forename}
						{...form.getInputProps('forename')}
					/>

					<TextInput
						label={t('surname')}
						placeholder={account.surname}
						{...form.getInputProps('surname')}
					/>

					<Select
						label={t('accountType')}
						data={[
							{ value: 'PERSONAL', label: t('accountTypes.personal') },
							{ value: 'PROFESSIONAL', label: t('accountTypes.professional') },
						]}
						{...form.getInputProps('accountType')}
					/>

					<Group justify="flex-end" mt="md">
						<Button type="submit" loading={isLoading}>
							{t('saveChanges')}
						</Button>
					</Group>
				</Stack>
			</form>
		</Card>
	);
} 