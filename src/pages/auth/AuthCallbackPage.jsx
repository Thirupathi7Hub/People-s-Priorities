import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { user, dashboardRoute, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate(dashboardRoute, { replace: true })
      } else {
        navigate('/auth/login', { replace: true })
      }
    }
  }, [loading, user, navigate, dashboardRoute])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--text-secondary)]">Completing sign in...</p>
      </div>
    </div>
  )
}
