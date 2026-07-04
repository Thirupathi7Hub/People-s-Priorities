import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/api'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email'); return }
    setLoading(true)
    setError(null)
    try {
      await authService.resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Forgot Password</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="card p-6">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-4xl">📧</div>
                <h3 className="font-semibold text-[var(--text-primary)]">Check your inbox</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Link to="/auth/login">
                  <Button variant="secondary" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-sm text-red-600">
                    ⚠️ {error}
                  </div>
                )}
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  Send Reset Link
                </Button>
                <Link to="/auth/login">
                  <Button variant="ghost" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Login
                  </Button>
                </Link>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
