import { Component, ErrorInfo, ReactNode } from 'react';
import { errorBoundaryFallback } from '../utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error Boundary component to catch and handle errors in child components
 * Uses the global error handler to display toast notifications for errors
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the global error handler
    errorBoundaryFallback(error);
    
    // Log component stack to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Component Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render a fallback UI or return the children to attempt recovery
      return this.props.fallback || this.props.children;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
