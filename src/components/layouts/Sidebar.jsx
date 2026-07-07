import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, FolderKanban, PieChart, Bell,
  Settings, User, LogOut, ChevronLeft, ChevronRight,
  Users, MapPin, Building2, Tag, BarChart3, Wallet,
  Shield, BookOpen, Globe, Menu, X, Brain, Flame, UserCheck,
  CheckCircle, TrendingUp, Star, ClipboardList, UploadCloud
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { authService } from '../../services/api'
import { cn } from '../../utils'
import { ROLES } from '../../constants'
import Avatar from '../ui/Avatar'

const navConfig = {
  [ROLES.CITIZEN]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/citizen' },
    { label: 'Submit Complaint', icon: FileText, to: '/dashboard/citizen/complaints/new' },
    { label: 'My Complaints', icon: ClipboardList, to: '/dashboard/citizen/complaints' },
    { label: 'Map View', icon: Globe, to: '/dashboard/citizen/map' },
    { label: 'Notifications', icon: Bell, to: '/dashboard/citizen/notifications' },
    { label: 'Profile', icon: User, to: '/dashboard/citizen/profile' },
    { label: 'Settings', icon: Settings, to: '/dashboard/citizen/settings' },
  ],
  [ROLES.MP]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/mp' },
    { label: 'All Complaints', icon: FileText, to: '/dashboard/mp/complaints' },
    { label: 'AI Priorities', icon: Brain, to: '/dashboard/mp/priorities' },
    { label: 'Heatmap', icon: Flame, to: '/dashboard/mp/map' },
    { label: 'Analytics', icon: BarChart3, to: '/dashboard/mp/analytics' },
    { label: 'Assign Officers', icon: UserCheck, to: '/dashboard/mp/assign' },
    { label: 'Reports', icon: PieChart, to: '/dashboard/mp/reports' },
    { label: 'Notifications', icon: Bell, to: '/dashboard/mp/notifications' },
    { label: 'Profile', icon: User, to: '/dashboard/mp/profile' },
    { label: 'Settings', icon: Settings, to: '/dashboard/mp/settings' },
  ],
  [ROLES.OFFICER]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/officer' },
    { label: 'Assigned Cases', icon: ClipboardList, to: '/dashboard/officer/complaints' },
    { label: 'Update Status', icon: CheckCircle, to: '/dashboard/officer/update' },
    { label: 'Performance', icon: TrendingUp, to: '/dashboard/officer/performance' },
    { label: 'Notifications', icon: Bell, to: '/dashboard/officer/notifications' },
    { label: 'Profile', icon: User, to: '/dashboard/officer/profile' },
    { label: 'Settings', icon: Settings, to: '/dashboard/officer/settings' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/admin' },
    { label: 'Users', icon: Users, to: '/dashboard/admin/users' },
    { label: 'Complaints', icon: FileText, to: '/dashboard/admin/complaints' },
    { label: 'Departments', icon: Building2, to: '/dashboard/admin/departments' },
    { label: 'Constituencies', icon: MapPin, to: '/dashboard/admin/constituencies' },
    { label: 'Categories', icon: Tag, to: '/dashboard/admin/categories' },
    { label: 'Reports', icon: BarChart3, to: '/dashboard/admin/reports' },
    { label: 'Notifications', icon: Bell, to: '/dashboard/admin/notifications' },
    { label: 'Settings', icon: Shield, to: '/dashboard/admin/settings' },
  ],
}

const roleColors = {
  [ROLES.CITIZEN]: 'from-blue-500 to-cyan-500',
  [ROLES.MP]: 'from-primary-500 to-violet-500',
  [ROLES.OFFICER]: 'from-amber-500 to-orange-500',
  [ROLES.ADMIN]: 'from-rose-500 to-pink-500',
}

const roleLabels = {
  [ROLES.CITIZEN]: 'Citizen',
  [ROLES.MP]: 'Member of Parliament',
  [ROLES.OFFICER]: 'Dept. Officer',
  [ROLES.ADMIN]: 'Administrator',
}

export function Sidebar({ collapsed, onToggle, mobile = false, onClose }) {
  const { user, profile, role } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const navItems = navConfig[role] || navConfig[ROLES.CITIZEN]
  const gradient = roleColors[role] || 'from-primary-500 to-violet-500'
  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'User'

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await authService.signOut()
      navigate('/')
    } catch (e) {
      console.error(e)
    } finally {
      setSigningOut(false)
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-[var(--border-color)]',
        collapsed && !mobile && 'justify-center'
      )}>
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shadow-md',
          gradient
        )}>
          PP
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="font-bold text-sm text-[var(--text-primary)] leading-none">People's</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Priorities</p>
          </div>
        )}
        {!mobile && (
          <button
            onClick={onToggle}
            className="ml-auto btn-ghost p-1.5 rounded-lg"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {mobile && (
          <button onClick={onClose} className="ml-auto btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Role badge */}
      {(!collapsed || mobile) && (
        <div className="px-4 py-3">
          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r', gradient)}>
            <Shield className="w-3 h-3" />
            {roleLabels[role]}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 3}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              collapsed && !mobile ? 'justify-center' : '',
              isActive
                ? `bg-gradient-to-r ${gradient} text-white shadow-sm`
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            )}
            title={collapsed && !mobile ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {(!collapsed || mobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-[var(--border-color)] p-3 space-y-2">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar
              src={profile?.avatar_url}
              name={fullName}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{fullName}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <div className={cn('flex gap-2', collapsed && !mobile ? 'flex-col items-center' : '')}>
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2 rounded-lg flex-1 flex items-center justify-center"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="btn-ghost p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex-1 flex items-center justify-center gap-2"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            {(!collapsed || mobile) && <span className="text-sm">Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  )

  if (mobile) {
    return sidebarContent
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sidebar h-full overflow-hidden shrink-0"
    >
      {sidebarContent}
    </motion.aside>
  )
}

export function MobileSidebar({ isOpen, onClose, role }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-overlay lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="sidebar fixed left-0 top-0 h-full w-72 z-50 lg:hidden overflow-hidden"
          >
            <Sidebar mobile onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
