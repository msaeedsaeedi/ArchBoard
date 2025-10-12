"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PageErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Page error boundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-6 p-8 max-w-md">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-destructive">
                Something went wrong
              </h2>
              <p className="text-muted-foreground">
                We encountered an error while loading this page. Please try
                again.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left bg-muted p-4 rounded-md">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details
                </summary>
                <code className="text-sm text-muted-foreground">
                  {this.state.error.message}
                </code>
              </details>
            )}

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                variant="outline"
              >
                Try Again
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
