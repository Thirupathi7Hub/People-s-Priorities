import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { authService } from '../../services/api'
import Avatar from '../ui/Avatar'

export function DashboardHeader({ onMenuClick }) {
  const { user, profile, role } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'User'
  const dashBase = `/dashboard/${role}`

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await authService.signOut()
    navigate('/')
  }

  return (
    <header
      className="sticky top-0 z-30 border-b flex items-center gap-4 px-4 sm:px-6 h-14 shrink-0"
      style={{
        background: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="btn-ghost p-2 rounded-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search complaints, projects..."
            className="input-base pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-lg"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark
            ? <Sun className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          }
        </button>

        {/* Notifications */}
        <Link to={`${dashBase}/notifications`} className="btn-ghost p-2 rounded-lg relative">
          <Bell className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>

        {/* User menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setUserMenuOpen(p => !p)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors"
            style={{ background: userMenuOpen ? 'var(--bg-tertiary)' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = userMenuOpen ? 'var(--bg-tertiary)' : 'transparent'}
          >
            <Avatar src={profile?.avatar_url} name={fullName} size="sm" />
            <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
              {fullName.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 hidden sm:block" style={{ color: 'var(--text-muted)' }} />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl z-20 overflow-hidden"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{fullName}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { to: `${dashBase}/profile`,  icon: User,     label: 'Profile' },
                      { to: `${dashBase}/settings`, icon: Settings, label: 'Settings' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
