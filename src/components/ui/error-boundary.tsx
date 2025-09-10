import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="p-4 rounded-full bg-error/10 text-error mb-6">
        <AlertTriangle className="h-12 w-12" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">出现了一些问题</h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || "应用程序遇到了意外错误，请尝试重新加载页面或联系支持团队。"}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={resetError} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          重试
        </Button>
        
        <Button onClick={() => window.location.href = '/'}>
          <Home className="h-4 w-4 mr-2" />
          返回首页
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-8 p-4 bg-muted rounded-lg text-left max-w-2xl w-full">
          <summary className="cursor-pointer font-medium mb-2">
            技术详情 (开发模式)
          </summary>
          <pre className="text-xs overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ title = "出错了", message, onRetry, className = "" }: ErrorMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="p-3 rounded-full bg-error/10 text-error mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-3 w-3 mr-2" />
          重试
        </Button>
      )}
    </div>
  );
}