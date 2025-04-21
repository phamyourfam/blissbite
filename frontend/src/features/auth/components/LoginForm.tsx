import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Group, Box, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { LoginFormValues } from './types';

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => Promise<void>;
    onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSubmit, onSwitchToSignup }: LoginFormProps) => {
    const { t: tCommon } = useTranslation('common', { keyPrefix: 'account' });
    const { t: tComponents } = useTranslation('components', { keyPrefix: 'authentication' });
    const [loginError, setLoginError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },
        validateInputOnBlur: true,
        validate: {
            email: (value) =>
                value === ''
                    ? 'Email is required'
                    : /^\S+@\S+$/.test(value)
                    ? null
                    : 'Invalid email address',
            password: (value) =>
                value === ''
                    ? 'Password is required'
                    : value.length >= 8
                    ? null
                    : 'Password must be at least 8 characters'
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await form.validate();
        if (!result.hasErrors) {
            try {
                await onSubmit(form.values);
            } catch (error: any) {
                setLoginError(
                    error.status === 401
                        ? 'Invalid email or password. Please try again.'
                        : error.data?.message || 'An error occurred during login. Please try again.'
                );
            }
        }
    };

    return (
        <Box component='form' onSubmit={handleSubmit}>
            {loginError && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title='Login Error'
                    color='red'
                    mb='md'
                    withCloseButton
                    onClose={() => setLoginError(null)}
                >
                    {loginError}
                </Alert>
            )}
            <TextInput
                label={tCommon('email')}
                placeholder='you@example.com'
                {...form.getInputProps('email')}
                required
            />
            <PasswordInput
                label={tCommon('password')}
                placeholder={tCommon('password')}
                mt='sm'
                {...form.getInputProps('password')}
                required
            />
            <Group mt='lg'>
                <Button type='submit'>
                    {tComponents('login')}
                </Button>
                <Button variant='subtle' onClick={onSwitchToSignup}>
                    {tComponents('noAccount')}
                </Button>
            </Group>
        </Box>
    );
}; 