import { cn } from '../../utils'

export function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <div
      className={cn(
        'card animate-fade-in',
        hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        glass && 'glass',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-5 pt-5 pb-0 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-base font-semibold text-[var(--text-primary)]', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-5 pb-5 pt-0 flex items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
