import { cn, getInitials } from '../../utils'

export function Avatar({ src, name, size = 'md', className, ring = false }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  }

  const ringColors = ring
    ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-[var(--bg-primary)]'
    : ''

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover shrink-0',
          sizes[size],
          ringColors,
          className
        )}
        onError={e => { e.target.style.display = 'none' }}
      />
    )
  }

  const initials = getInitials(name)
  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-accent-100 text-accent-700',
    'bg-green-100 text-green-700',
    'bg-amber-100 text-amber-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
  ]
  const colorIndex = (name?.charCodeAt(0) || 0) % colors.length

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold shrink-0',
        sizes[size],
        colors[colorIndex],
        ringColors,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}

export function AvatarGroup({ users = [], max = 3, size = 'sm' }) {
  const visible = users.slice(0, max)
  const rest = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <Avatar
          key={i}
          src={u.avatar_url}
          name={u.full_name}
          size={size}
          className="border-2 border-[var(--bg-card)]"
        />
      ))}
      {rest > 0 && (
        <div className={cn(
          'rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--bg-card)] flex items-center justify-center text-xs font-semibold text-[var(--text-secondary)]',
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        )}>
          +{rest}
        </div>
      )}
    </div>
  )
}

export default Avatar
