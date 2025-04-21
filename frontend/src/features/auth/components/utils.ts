import { AnyAction } from '@reduxjs/toolkit';
import { SignupFormValues, PasswordStrength } from './types';
import { setSignupFormData } from '../authSlice';

export const saveSessionState = (
    step: number,
    isTemporary: boolean,
    formData: SignupFormValues | undefined,
    dispatch: (action: AnyAction) => void
) => {
    const sessionData = {
        step,
        isTemporary,
        formData
    };

    sessionStorage.setItem('authSession', JSON.stringify(sessionData));
    
    if (formData) {
        dispatch(setSignupFormData(formData));
    }
};

export const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, color: 'gray', label: 'Enter password' };

    let score = 0;

    const length = password.length;
    if (length >= 12) {
        score += 25;
    } else if (length >= 10) {
        score += 15;
    } else if (length >= 8) {
        score += 10;
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecials = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (hasLowercase) score += 10;
    if (hasUppercase) score += 15;
    if (hasNumbers) score += 20;
    if (hasSpecials) score += 30;

    if (/(.)\1{2,}/.test(password)) {
        score -= 15;
    }

    if (/(?:abcdef|bcdefg|cdefgh|defghi|efghij|fghijk|ghijkl|hijklm|ijklmn|jklmno|klmnop|lmnopq|mnopqr|nopqrs|opqrst|pqrstu|qrstuv|rstuvw|stuvwx|tuvwxy|uvwxyz|0123456|1234567|2345678|3456789)/i.test(password)) {
        score -= 15;
    }

    score = Math.max(0, Math.min(100, score));

    let color = 'gray';
    let label = 'Very Weak';

    if (score >= 85) {
        color = 'teal';
        label = 'Very Strong';
    } else if (score >= 70) {
        color = 'green';
        label = 'Strong';
    } else if (score >= 50) {
        color = 'blue';
        label = 'Moderate';
    } else if (score >= 30) {
        color = 'orange';
        label = 'Weak';
    } else if (score > 0) {
        color = 'pink';
        label = 'Very Weak';
    }

    return { score, color, label };
};

export const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    if (!/^\S+@\S+$/.test(email)) return 'Invalid email address';
    return null;
};

export const validatePassword = (password: string) => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
}; 