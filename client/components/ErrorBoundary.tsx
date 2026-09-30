import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangleIcon className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-[#2C1810] mb-4">
              Oops! Something went wrong.
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              We've encountered an unexpected error while trying to load this page. Our technical team has been notified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center justify-center px-6 py-3 bg-[#B8860B] text-white font-bold rounded-xl hover:bg-[#8B6508] transition-colors shadow-sm"
              >
                <RefreshCwIcon className="w-5 h-5 mr-2" />
                Reload Page
              </button>
              
              <button 
                onClick={() => window.location.href = '/'} 
                className="inline-flex items-center justify-center px-6 py-3 bg-[#ECDFD7] text-[#8B6508] font-bold rounded-xl hover:bg-[#E8DCC4] transition-colors"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Go Home
              </button>
            </div>
            
            
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

