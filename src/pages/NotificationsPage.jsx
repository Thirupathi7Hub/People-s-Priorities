import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatRelativeTime } from '../utils'
import { EmptyState } from '../components/ui/ErrorBoundary'

const mockNotifications = [
  { id: 1, title: 'Status Update', message: 'Your complaint "Pothole on MG Road" has been updated to In Progress.', type: 'complaint_update', is_read: false, created_at: '2024-01-15T10:00:00Z' },
  { id: 2, title: 'New Comment', message: 'An officer commented on your complaint "Water supply issue".', type: 'comment', is_read: false, created_at: '2024-01-15T09:00:00Z' },
  { id: 3, title: 'Project Update', message: 'The Highway Widening Project in your area has reached 65% completion.', type: 'project_update', is_read: true, created_at: '2024-01-14T16:00:00Z' },
  { id: 4, title: 'New Scheme Available', message: 'PM Awas Yojana — New housing scheme launched for your constituency.', type: 'scheme', is_read: true, created_at: '2024-01-13T11:00:00Z' },
  { id: 5, title: 'Complaint Resolved', message: 'Your complaint "Garbage collection" has been marked as resolved.', type: 'complaint_update', is_read: true, created_at: '2024-01-12T14:00:00Z' },
  { id: 6, title: 'Vote Cast', message: 'Your vote on the "Electricity issue" complaint has been recorded.', type: 'vote', is_read: true, created_at: '2024-01-11T09:00:00Z' },
]

const typeConfig = {
  complaint_update: { color: 'color-primary', emoji: '📋', badge: 'primary' },
  comment: { color: 'color-info', emoji: '💬', badge: 'info' },
  project_update: { color: 'color-success', emoji: '🏗️', badge: 'success' },
  scheme: { color: 'color-warning', emoji: '📜', badge: 'warning' },
  vote: { color: 'color-accent', emoji: '👍', badge: 'accent' },
  system: { color: 'color-muted', emoji: '🔔', badge: 'muted' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => !n.is_read).length
  const filtered = filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  const deleteN = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} leftIcon={<CheckCheck className="w-4 h-4" />}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 w-fit">
        {['all', 'unread'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'
            }`}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-primary-500 text-white text-[10px] rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={filter === 'unread' ? "You're all caught up!" : "No notifications yet."}
            />
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {filtered.map((n, i) => {
                const cfg = typeConfig[n.type] || typeConfig.system
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`px-5 py-4 flex items-start gap-4 hover:bg-[var(--bg-tertiary)] transition-colors ${!n.is_read ? 'bg-primary-50/50 dark:bg-primary-950/10' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-lg shrink-0 mt-0.5">
                      {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-semibold ${!n.is_read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1.5">{formatRelativeTime(n.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.is_read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="btn-ghost p-1.5 rounded-lg text-primary-500"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteN(n.id)}
                        className="btn-ghost p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
