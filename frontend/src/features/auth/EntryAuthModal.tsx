import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
	Modal,
	Button,
	TextInput,
	PasswordInput,
	Stepper,
	Group,
	Box,
	Progress,
	Text,
	Transition,
	Alert
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle } from '@tabler/icons-react';
import {
	useLoginMutation,
	useSignupStartMutation,
	useVerifyEmailCodeMutation,
	useCompleteSignupMutation,
	useDeleteAccountMutation,
	useResendVerificationCodeMutation
} from '../../services/authApi';
import {
	setCredentials,
	setAuthMode,
	setIsTemporaryAccount,
	setSignupFormData,
	clearSignupState,
	saveSignupSession,
	selectIsTemporaryAccount,
	selectSignupFormData,
	selectAuthMode
} from './authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { VerificationForm } from './components/VerificationForm';
import { saveSessionState } from './components/utils';
import { SignupFormValues, LoginFormValues } from './components/types';

export const EntryAuthModal = () => {
	const { t: tComponents } = useTranslation('components', { keyPrefix: 'authentication' });
	const [opened, { open, close }] = useDisclosure(false);
	const dispatch = useDispatch();
	const authMode = useSelector(selectAuthMode);
	const isTemporaryAccount = useSelector(selectIsTemporaryAccount);
	const reduxFormData = useSelector(selectSignupFormData);
	const [activeStep, setActiveStep] = useState(0);
	const [, setLocation] = useLocation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [loginMutation] = useLoginMutation();
	const [signupStartMutation] = useSignupStartMutation();
	const [verifyEmailCodeMutation] = useVerifyEmailCodeMutation();
	const [completeSignupMutation] = useCompleteSignupMutation();
	const [deleteAccountMutation] = useDeleteAccountMutation();
	const [resendVerificationCodeMutation] = useResendVerificationCodeMutation();

	// Load session state from storage on initial render
	useEffect(() => {
		const savedSession = sessionStorage.getItem('authSession');
		if (savedSession) {
			try {
				const sessionData = JSON.parse(savedSession);
				dispatch(setAuthMode('signup'));
				dispatch(setIsTemporaryAccount(sessionData.isTemporary));

				if (sessionData.formData) {
					dispatch(setSignupFormData(sessionData.formData));
					if (sessionData.step === 1) {
						open();
					}
				}
			} catch (e) {
				console.error('Error restoring auth session:', e);
				sessionStorage.removeItem('authSession');
			}
		}
	}, []);

	// Check for temp account on initial render and set default step
	useEffect(() => {
		const savedSession = sessionStorage.getItem('authSession');
		let tempAccount = null;
		if (
			reduxFormData &&
			reduxFormData.tempAccountId &&
			(reduxFormData.accountId || sessionStorage.getItem('lastSignupAccountId'))
		) {
			tempAccount = reduxFormData;
		}
		if (!tempAccount && savedSession) {
			try {
				const sessionData = JSON.parse(savedSession);
				if (
					sessionData.formData &&
					sessionData.formData.tempAccountId &&
					(sessionData.formData.accountId ||
						sessionStorage.getItem('lastSignupAccountId'))
				) {
					tempAccount = sessionData.formData;
				}
			} catch {}
		}
		if (tempAccount) {
			setActiveStep(1);
		} else {
			setActiveStep(0);
		}
	}, [opened]);

	// Check for a verification token in the URL
	const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
	useEffect(() => {
		if (tokenFromUrl) {
			dispatch(setAuthMode('signup'));
			setActiveStep(1);
			dispatch(setIsTemporaryAccount(true));
			open();
			saveSessionState(1, true, undefined, dispatch);
		}
	}, [tokenFromUrl, dispatch]);

	const clearSessionState = () => {
		sessionStorage.removeItem('authSession');
		dispatch(clearSignupState());
	};

	const handleLoginSubmit = async (values: LoginFormValues) => {
		try {
			const response = await loginMutation(values).unwrap();
			dispatch(
				setCredentials({
					account: response.account,
					sessionToken: response.sessionToken
				})
			);
			close();
			clearSessionState();
		} catch (error: any) {
			throw error;
		}
	};

	const handleResendCode = async (email: string, tempAccountId: string) => {
		try {
			await resendVerificationCodeMutation({ email, tempAccountId }).unwrap();
			notifications.show({
				title: 'Success',
				message: 'Verification code has been resent',
				color: 'green'
			});
		} catch (error: any) {
			notifications.show({
				title: 'Error',
				message: error.data?.message || error.message || 'Failed to resend verification code',
				color: 'red'
			});
		}
	};

	const handleSignupSubmit = async (values: SignupFormValues) => {
		try {
			setIsSubmitting(true);
			if (activeStep === 0) {
				const signupData = {
					email: values.email,
					password: values.password,
					forename: values.forename || '',
					surname: values.surname || ''
				};

				const response = await signupStartMutation(signupData).unwrap();

				if (response.tempAccountId && response.accountId) {
					const updatedValues = {
						...values,
						tempAccountId: response.tempAccountId,
						accountId: response.accountId
					} as SignupFormValues;

					sessionStorage.setItem('lastSignupAccountId', response.accountId);
					setActiveStep(1);
					dispatch(setIsTemporaryAccount(true));
					dispatch(setSignupFormData(updatedValues));
					saveSessionState(1, true, updatedValues, dispatch);
				}
			} else if (values.tempAccountId && values.accountId && values.verificationCode) {
				// First step: Verify the code to get a token
				const verificationResponse = await verifyEmailCodeMutation({
					tempAccountId: values.tempAccountId,
					accountId: values.accountId,
					code: values.verificationCode
				}).unwrap();

				if (!verificationResponse.token) {
					throw new Error('No verification token received');
				}

				// Second step: Complete the signup with the token
				const completeResponse = await completeSignupMutation({
					tempAccountId: values.tempAccountId,
					accountId: values.accountId,
					verificationToken: verificationResponse.token
				}).unwrap();

				dispatch(
					setCredentials({
						account: completeResponse.account,
						sessionToken: completeResponse.sessionToken
					})
				);

				clearSessionState();
				close();
				setActiveStep(0);
				dispatch(setIsTemporaryAccount(false));
				setLocation('/account/settings');
			} else {
				throw new Error('Missing required fields for verification');
			}
		} catch (error: any) {
			console.error('Signup error:', error);
			notifications.show({
				title: 'Error',
				message: error.data?.message || error.message || 'An error occurred during signup',
				color: 'red'
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBackToDetails = () => {
		setActiveStep(0);
		saveSessionState(0, isTemporaryAccount, reduxFormData || undefined, dispatch);
	};

	const handleModalClose = () => {
		if (authMode === 'signup' && isTemporaryAccount) {
			clearSessionState();
		}
		close();
	};

	const handleCancelAccountCreation = async () => {
		try {
			const accountId =
				reduxFormData?.accountId || sessionStorage.getItem('lastSignupAccountId');

			if (accountId) {
				await deleteAccountMutation({ accountId }).unwrap();
			}
		} catch (e) {
			console.error('Failed to delete temp account', e);
		}

		clearSessionState();
		sessionStorage.removeItem('lastSignupAccountId');
		setActiveStep(0);
		dispatch(setIsTemporaryAccount(false));
		close();
	};

	const handleLoginOpen = () => {
		dispatch(setAuthMode('login'));
		open();
	};

	const handleSignupOpen = () => {
		const formData = reduxFormData || (() => {
			try {
				const savedSession = sessionStorage.getItem('authSession');
				if (savedSession) {
					return JSON.parse(savedSession).formData;
				}
				return null;
			} catch (e) {
				return null;
			}
		})();

		const hasTempAccount =
			formData &&
			formData.tempAccountId &&
			(formData.accountId || sessionStorage.getItem('lastSignupAccountId'));

		if (hasTempAccount) {
			if (!formData.accountId) {
				const lastAccountId = sessionStorage.getItem('lastSignupAccountId');
				if (lastAccountId) {
					dispatch(
						setSignupFormData({
							...formData,
							accountId: lastAccountId
						})
					);
				}
			}

			dispatch(setAuthMode('signup'));
			dispatch(setIsTemporaryAccount(true));
			dispatch(setSignupFormData(formData));
			setActiveStep(1);
		} else {
			dispatch(setAuthMode('signup'));
			setActiveStep(0);
			dispatch(setIsTemporaryAccount(false));
		}

		open();
	};

	const defaultSignupValues: SignupFormValues = {
		email: '',
		password: '',
		confirmPassword: '',
		forename: '',
		surname: '',
		tempAccountId: undefined,
		accountId: undefined,
		verificationCode: undefined
	};

	return (
		<>
			<Modal.Root opened={opened} onClose={handleModalClose} centered>
				<Modal.Overlay />
				<Modal.Content>
					{authMode === 'login' ? (
						<>
							<Modal.Header>
								<Modal.Title>
									<strong>{tComponents('login')}</strong>
								</Modal.Title>
								<Modal.CloseButton />
							</Modal.Header>
							<Modal.Body>
								<LoginForm
									onSubmit={handleLoginSubmit}
									onSwitchToSignup={handleSignupOpen}
								/>
							</Modal.Body>
						</>
					) : (
						<>
							<Modal.Header>
								<Modal.Title>
									<strong>sign up</strong>
								</Modal.Title>
								<Modal.CloseButton />
							</Modal.Header>
							<Modal.Body>
								<Stepper
									active={activeStep}
									onStepClick={(step) => {
										if (step === 0 && activeStep === 1) {
											setActiveStep(0);
											saveSessionState(
												0,
												isTemporaryAccount,
												reduxFormData || undefined,
												dispatch
											);
										}
									}}
									allowNextStepsSelect={false}
									color="green"	
									progressIcon={({ step }) => <span>{step + 1}</span>}
								>
									<Stepper.Step
										label="e"
										description="create account"
									>
										<SignupForm
											initialValues={reduxFormData || undefined}
											onSubmit={handleSignupSubmit}
											onSwitchToLogin={handleLoginOpen}
											isSubmitting={isSubmitting}
										/>
									</Stepper.Step>
									<Stepper.Step
										label="verify"
										description="email verification"
									>
										{isTemporaryAccount && (
											<VerificationForm
												email={reduxFormData?.email || ''}
												tempAccountId={reduxFormData?.tempAccountId}
												verificationCode={reduxFormData?.verificationCode}
												onVerificationCodeChange={(code) => {
													if (reduxFormData) {
														const updatedFormData = {
															...reduxFormData,
															verificationCode: code
														};
														dispatch(setSignupFormData(updatedFormData));
													}
												}}
												onBack={handleBackToDetails}
												onResendCode={() => {
													if (reduxFormData?.email && reduxFormData?.tempAccountId) {
														void handleResendCode(reduxFormData.email, reduxFormData.tempAccountId);
													}
												}}
												onSubmit={() => {
													if (reduxFormData) {
														void handleSignupSubmit(reduxFormData);
													}
												}}
												isSubmitting={isSubmitting}
											/>
										)}
									</Stepper.Step>
								</Stepper>
							</Modal.Body>
						</>
					)}
				</Modal.Content>
			</Modal.Root>

			<Group>
				<Button variant='default' onClick={handleLoginOpen}>
					{tComponents('login')}
				</Button>
				<Button onClick={handleSignupOpen}>{tComponents('signUp')}</Button>
			</Group>
		</>
	);
};
