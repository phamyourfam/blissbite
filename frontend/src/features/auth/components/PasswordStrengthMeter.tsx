import { Progress, Group, Text } from '@mantine/core';
import { PasswordStrength } from './types';

interface PasswordStrengthMeterProps {
    strength: PasswordStrength;
}

export const PasswordStrengthMeter = ({ strength }: PasswordStrengthMeterProps) => {
    return (
        <>
            <Progress
                value={strength.score}
                size='xs'
                color={strength.color}
                mt={5}
            />
            <Group justify='space-between' mt='md'>
                <Text size='xs' color={strength.color}>
                    {strength.label}
                </Text>
                <Text
                    size='xs'
                    color={
                        strength.score >= 50
                            ? 'blue'
                            : strength.score > 0
                            ? 'orange'
                            : 'gray'
                    }
                >
                    {strength.score >= 50
                        ? 'Acceptable'
                        : strength.score > 0
                        ? 'Not strong enough'
                        : ''}
                </Text>
            </Group>
            <Text size='xs' color='dimmed' mb={10}>
                Use 8+ characters with a mix of uppercase, lowercase, numbers, and special characters.
            </Text>
        </>
    );
}; 