"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Production: debug output removed
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
            <div className="max-w-md w-full bg-card rounded-card shadow-card border border-grayBorder p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text mb-2">Something went wrong</h2>
                <p className="text-grayText mb-4">
                  We encountered an unexpected error. Don&apos;t worry, your data is safe.
                </p>
              </div>

              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="button"
                    onClick={this.handleReset}
                    className="w-full px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-3 bg-graySoft text-text rounded-xl font-medium hover:bg-grayBorder transition-colors"
                  >
                    Reload page
                  </button>
                </motion.div>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-grayText hover:text-text">
                    Show error details
                  </summary>
                  <div className="mt-2 p-3 bg-graySoft rounded-lg text-xs font-mono text-red-600 overflow-auto max-h-40">
                    <div className="mb-2 font-bold">{this.state.error.name}: {this.state.error.message}</div>
                    <div className="whitespace-pre-wrap">{this.state.error.stack}</div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

