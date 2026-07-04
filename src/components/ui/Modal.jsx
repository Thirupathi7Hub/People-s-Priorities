import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils'

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                'w-full bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden',
                sizes[size],
                className
              )}
              onClick={e => e.stopPropagation()}
            >
              {(title || onClose) && (
                <div className="flex items-start justify-between gap-4 p-5 border-b border-[var(--border-color)]">
                  <div>
                    {title && (
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
                    )}
                    {description && (
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="btn-ghost p-1.5 shrink-0 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="overflow-y-auto max-h-[80vh]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
