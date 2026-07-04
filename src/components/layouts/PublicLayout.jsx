import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { NAV_LINKS } from '../../constants'
import Button from '../ui/Button'

function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'var(--bg-primary)'
          : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold shadow-lg">
              PP
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-extrabold leading-none" style={{ color: 'var(--text-primary)' }}>
                People's Priorities
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                AI-Powered Governance
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink
                key={href}
                to={href}
                end={href === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'hover:bg-gray-100 dark:hover:bg-white/5'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? undefined : 'var(--text-secondary)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2 rounded-lg"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost p-2 rounded-lg">
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setOpen(p => !p)} className="btn-ghost p-2 rounded-lg">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'var(--bg-primary)',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div className="container-app py-4 space-y-1">
              {NAV_LINKS.map(({ label, href }) => (
                <NavLink
                  key={href}
                  to={href}
                  end={href === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-primary-600 bg-primary-50' : ''
                    }`
                  }
                  style={({ isActive }) => ({ color: isActive ? undefined : 'var(--text-secondary)' })}
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/auth/login" className="w-full">
                  <Button variant="secondary" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth/register" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container-app py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold">
                PP
              </div>
              <p className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>People's Priorities</p>
            </div>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              AI-powered platform for transparent governance and participatory democracy across India.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Platform</p>
            <div className="space-y-2">
              {['Features', 'About', 'Contact'].map(l => (
                <Link key={l} to={`/${l.toLowerCase()}`} className="block text-sm transition-colors hover:text-primary-600" style={{ color: 'var(--text-muted)' }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Legal</p>
            <div className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'RTI'].map(l => (
                <a key={l} href="#" className="block text-sm transition-colors hover:text-primary-600" style={{ color: 'var(--text-muted)' }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} People's Priorities. Government of India Initiative. 🇮🇳
          </p>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Globe className="w-3 h-3" />
            Available in English · हिन्दी · தமிழ்
          </div>
        </div>
      </div>
    </footer>
  )
}

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
