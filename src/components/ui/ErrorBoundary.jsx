import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Error</h3>
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title = 'No data found',
  description = '',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
          <Icon className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export default ErrorBoundary
