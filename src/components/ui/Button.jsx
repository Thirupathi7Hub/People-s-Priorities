import { cn } from '../../utils'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  leftIcon,
  rightIcon,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none select-none'

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm hover:from-primary-600 hover:to-primary-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:border-primary-400 hover:text-primary-500',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20',
  }

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-lg',
    icon: 'p-2.5',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}

export default Button
