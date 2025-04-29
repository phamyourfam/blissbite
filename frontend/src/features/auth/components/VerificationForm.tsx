import { TextInput, Button, Group, Box, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { SignupFormValues } from './types';

interface VerificationFormProps {
    email: string;
    tempAccountId: string | undefined;
    verificationCode: string | undefined;
    onVerificationCodeChange: (code: string) => void;
    onBack: () => void;
    onResendCode: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const VerificationForm = ({
    email,
    tempAccountId,
    verificationCode,
    onVerificationCodeChange,
    onBack,
    onResendCode,
    onSubmit,
    isSubmitting
}: VerificationFormProps) => {
    const { t: tComponents } = useTranslation('components', { keyPrefix: 'authentication' });

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow alphanumeric characters and convert to uppercase
        const code = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        console.log('Code input changed:', { raw: e.target.value, processed: code });
        onVerificationCodeChange(code);
    };

    return (
        <Box mt="md">
            <Alert
                icon={<IconAlertCircle size={16} />}
                title='Email Verification Required'
                color='blue'
                mb="md"
            >
                Please check your email ({email}) for a verification code. A temporary account has been
                created and will be fully activated after verification. If you don't verify within 24 hours, 
                the temporary account will expire.
            </Alert>
            <TextInput
                label="Verification Code"
                placeholder='Enter the 6-digit code from your email'
                value={verificationCode || ''}
                onChange={handleCodeChange}
                maxLength={6}
                required
            />
            <Group mt="md" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='default' onClick={onBack}>
                    {tComponents('back')}
                </Button>
                <Button 
                    variant='subtle' 
                    onClick={onResendCode}
                    disabled={!email || !tempAccountId}
                >
                    {tComponents('resend')}
                </Button>
            </Group>
            <Button 
                fullWidth 
                mt="md"
                onClick={onSubmit}
                disabled={!verificationCode || !tempAccountId || isSubmitting}
                loading={isSubmitting}
            >
                {tComponents('verifyEmail')}
            </Button>
        </Box>
    );
}; 