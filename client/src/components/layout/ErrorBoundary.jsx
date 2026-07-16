import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-danger-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              An unexpected error occurred. Please try refreshing the page or go back to the dashboard.
            </p>
            <Button onClick={this.handleReset} leftIcon={RefreshCw}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
