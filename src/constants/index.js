export const APP_NAME = "People's Priorities"
export const APP_TAGLINE = "AI-Powered Constituency Planning Platform"
export const APP_DESCRIPTION = "Empowering citizens to shape their communities through transparent governance and AI-driven insights."

export const ROLES = {
  CITIZEN: 'citizen',
  MP: 'mp',
  OFFICER: 'officer',
  ADMIN: 'admin',
}

export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected',
}

export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

export const PROJECT_STATUS = {
  PROPOSED: 'proposed',
  APPROVED: 'approved',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
}

export const NOTIFICATION_TYPES = {
  COMPLAINT_UPDATE: 'complaint_update',
  COMMENT: 'comment',
  PROJECT_UPDATE: 'project_update',
  SCHEME: 'scheme',
  SYSTEM: 'system',
  VOTE: 'vote',
}

export const CATEGORIES = [
  { id: 1, name: 'Roads & Infrastructure', icon: '🛣️', color: '#f59e0b' },
  { id: 2, name: 'Water Supply', icon: '💧', color: '#3b82f6' },
  { id: 3, name: 'Sanitation', icon: '🚿', color: '#10b981' },
  { id: 4, name: 'Electricity', icon: '⚡', color: '#eab308' },
  { id: 5, name: 'Healthcare', icon: '🏥', color: '#ef4444' },
  { id: 6, name: 'Education', icon: '📚', color: '#8b5cf6' },
  { id: 7, name: 'Environment', icon: '🌿', color: '#22c55e' },
  { id: 8, name: 'Public Safety', icon: '🛡️', color: '#6366f1' },
  { id: 9, name: 'Agriculture', icon: '🌾', color: '#ca8a04' },
  { id: 10, name: 'Transportation', icon: '🚌', color: '#f97316' },
  { id: 11, name: 'Housing', icon: '🏠', color: '#06b6d4' },
  { id: 12, name: 'Employment', icon: '💼', color: '#a855f7' },
]

export const STATUS_CONFIG = {
  [COMPLAINT_STATUS.PENDING]: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', darkBg: '#451a03', class: 'status-pending' },
  [COMPLAINT_STATUS.OPEN]: { label: 'Open', color: '#3b82f6', bg: '#dbeafe', darkBg: '#1e3a5f', class: 'status-open' },
  [COMPLAINT_STATUS.IN_PROGRESS]: { label: 'In Progress', color: '#8b5cf6', bg: '#ede9fe', darkBg: '#3b2060', class: 'status-progress' },
  [COMPLAINT_STATUS.RESOLVED]: { label: 'Resolved', color: '#22c55e', bg: '#d1fae5', darkBg: '#064e3b', class: 'status-resolved' },
  [COMPLAINT_STATUS.CLOSED]: { label: 'Closed', color: '#6b7280', bg: '#f1f5f9', darkBg: '#1e293b', class: 'status-closed' },
  [COMPLAINT_STATUS.REJECTED]: { label: 'Rejected', color: '#ef4444', bg: '#fee2e2', darkBg: '#450a0a', class: 'status-pending' },
}

export const PRIORITY_CONFIG = {
  [COMPLAINT_PRIORITY.LOW]: { label: 'Low', color: '#22c55e' },
  [COMPLAINT_PRIORITY.MEDIUM]: { label: 'Medium', color: '#f59e0b' },
  [COMPLAINT_PRIORITY.HIGH]: { label: 'High', color: '#f97316' },
  [COMPLAINT_PRIORITY.CRITICAL]: { label: 'Critical', color: '#ef4444' },
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Contact', href: '/contact' },
]

export const DASHBOARD_ROUTES = {
  [ROLES.CITIZEN]: '/dashboard/citizen',
  [ROLES.MP]: '/dashboard/mp',
  [ROLES.OFFICER]: '/dashboard/officer',
  [ROLES.ADMIN]: '/dashboard/admin',
}

export const CHART_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
  '#a855f7', '#f97316', '#10b981', '#eab308',
]

export const MOCK_STATS = {
  totalComplaints: 12847,
  resolvedComplaints: 9203,
  activeProjects: 234,
  totalBudget: 45600000,
  citizens: 287450,
  constituencies: 48,
}
