/**
 * @file authentication.types.ts
 * @description Type definitions for authentication module
 */

type AccountType = 'personal' | 'professional';
type AccountStatus = 'pending' | 'active' | 'suspended' | 'deleted';

interface TempSignupData {
  email: string;
  hashedPassword: string;
  forename?: string;
  surname?: string;
  accountId: string; // Reference to the temporary account in the database
  expiresAt: number;
}

interface SessionPayload {
  token: string;
  accountId: string;
  expiresAt: Date;
}

interface AccountPayload {
  id: string;
  email: string;
  name?: string;
  type: AccountType;
  status: AccountStatus;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupStartPayload {
  email: string;
  password: string;
  forename?: string;
  surname?: string;
  tempAccountId?: string; // For resending verification code
  resendCode?: boolean; // Flag to indicate resending verification code
}

interface VerificationPayload {
  tempAccountId: string;
  code: string;
}

interface CompleteSignupRequest {
  tempAccountId: string;
  token: string;
}

export {
  AccountType,
  AccountStatus,
  TempSignupData,
  SessionPayload,
  AccountPayload,
  LoginCredentials,
  SignupStartPayload,
  VerificationPayload,
  CompleteSignupRequest
};
