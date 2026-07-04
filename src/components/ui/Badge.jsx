import { cn } from '../../utils'

const statusVariants = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  in_progress: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  proposed: 'bg-sky-100 text-sky-700',
  approved: 'bg-emerald-100 text-emerald-700',
  ongoing: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

const colorVariants = {
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-pink-100 text-pink-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  muted: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
}

export function Badge({
  children,
  status,
  color,
  dot = false,
  size = 'sm',
  className,
  ...props
}) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  const variant = status ? statusVariants[status] : color ? colorVariants[color] : colorVariants.muted

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size],
        variant,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const labels = {
    pending: 'Pending',
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
    proposed: 'Proposed',
    approved: 'Approved',
    ongoing: 'Ongoing',
    completed: 'Completed',
    on_hold: 'On Hold',
    cancelled: 'Cancelled',
  }
  return <Badge status={status} dot>{labels[status] || status}</Badge>
}

export function PriorityBadge({ priority }) {
  const labels = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }
  return <Badge status={priority}>{labels[priority] || priority}</Badge>
}

export default Badge
