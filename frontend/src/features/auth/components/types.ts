export interface SignupFormValues {
    email: string;
    password: string;
    confirmPassword?: string;
    forename?: string;
    surname?: string;
    tempAccountId?: string;
    accountId?: string;
    verificationCode?: string;
}

export interface VerifyCodeRequest {
    tempAccountId: string;
    accountId: string;
    code: string;
}

export interface CompleteSignupRequest {
    tempAccountId: string;
    accountId: string;
    verificationToken: string;
}

export interface PasswordStrength {
    score: number;
    color: string;
    label: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
} 