import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Group, Box, Transition } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { SignupFormValues } from './types';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { getPasswordStrength, validateEmail, validatePassword } from './utils';

interface SignupFormProps {
    initialValues?: SignupFormValues;
    onSubmit: (values: SignupFormValues) => Promise<void>;
    onSwitchToLogin: () => void;
    isSubmitting?: boolean;
}

export const SignupForm = ({ initialValues, onSubmit, onSwitchToLogin, isSubmitting = false }: SignupFormProps) => {
    const { t: tCommon } = useTranslation('common', { keyPrefix: 'account' });
    const { t: tComponents } = useTranslation('components', { keyPrefix: 'authentication' });
    const [formValid, setFormValid] = useState(false);

    const form = useForm<SignupFormValues>({
        initialValues: initialValues || {
            forename: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
            verificationCode: undefined
        },
        validateInputOnBlur: true,
        validate: {
            email: (value = '') => validateEmail(value),
            password: (value = '') => validatePassword(value),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords do not match' : null
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await form.validate();
        if (!result.hasErrors) {
            await onSubmit(form.values);
        }
    };

    const passwordStrength = getPasswordStrength(form.values.password);

    return (
        <Box component='form' onSubmit={handleSubmit}>
            <TextInput
                label={tCommon('forename')}
                placeholder={tCommon('forename')}
                {...form.getInputProps('forename')}
                required
            />
            <TextInput
                label={tCommon('surname')}
                placeholder={tCommon('surname')}
                mt='sm'
                {...form.getInputProps('surname')}
                required
            />
            <TextInput
                label={tCommon('email')}
                placeholder='you@example.com'
                mt='sm'
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
            {form.values.password && (
                <>
                    <PasswordStrengthMeter strength={passwordStrength} />
                    <Transition
                        mounted={form.values.password.length >= 1}
                        transition='slide-down'
                        duration={400}
                        timingFunction='ease'
                    >
                        {(styles) => (
                            <div style={styles}>
                                <PasswordInput
                                    label='Confirm Password'
                                    placeholder='Confirm your password'
                                    mt='sm'
                                    {...form.getInputProps('confirmPassword')}
                                    required
                                />
                            </div>
                        )}
                    </Transition>
                </>
            )}
            <Group mt='lg'>
                <Button
                    type="submit"
                    fullWidth
                    mt="md"
                    loading={isSubmitting}
                >
                    {tComponents('signUp')}
                </Button>
                <Button variant='subtle' onClick={onSwitchToLogin}>
                    {tComponents('existingAccount')}
                </Button>
            </Group>
        </Box>
    );
}; 