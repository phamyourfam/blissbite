import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import React from 'react';

/**
 * Global error handler for unexpected application errors
 * @param error The error object or error message
 * @param title Optional custom title for the notification
 */
export const handleGlobalError = (error: unknown, title = 'Unexpected Error'): void => {
  // Extract error message based on error type
  let message = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message);
  }

  // Show error notification
  notifications.show({
    title,
    message,
    color: 'red',
    icon: React.createElement(IconX, { size: 18 }),
    autoClose: 5000,
    withCloseButton: true
  });
  
  // Optionally log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Global error:', error);
  }
};

/**
 * Creates an error boundary fallback component for React components
 * @param error The error that occurred
 * @returns void
 */
export const errorBoundaryFallback = (error: Error): void => {
  handleGlobalError(error, 'Component Error');
};
