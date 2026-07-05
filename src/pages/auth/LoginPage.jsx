import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Globe, Sparkles } from 'lucide-react'
import { authService } from '../../services/api'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})


export default function LoginPage() {
  const navigate = useNavigate()
  const { dashboardRoute } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [authMode, setAuthMode] = useState('password') // 'password' | 'otp'
  const [otpSent, setOtpSent] = useState(false)
  const [otpToken, setOtpToken] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setError(null)
    setLoading(true)
    try {
      await authService.signIn(data)
      navigate(dashboardRoute)
    } catch (e) {
      setError(e.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      await authService.signInWithGoogle()
      navigate(dashboardRoute)
    } catch (e) {
      setError(e.message)
      setGoogleLoading(false)
    }
  }

  const handleSendOTP = async () => {
    setError(null)
    setOtpSent(true)
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    try {
      // Simulate verification in demo mode
      await authService.signIn({ email: 'citizen@priorities.gov.in', password: 'password123' })
      navigate('/dashboard/citizen')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-4">
      <div className="w-full max-w-md my-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                PP
              </div>
            </Link>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Welcome back</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to your People's Priorities account
            </p>
          </div>

          <div className="card p-6">
            {/* Auth mode toggle */}
            <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 mb-6">
              {['password', 'otp'].map(mode => (
                <button
                  key={mode}
                  onClick={() => { setAuthMode(mode); setError(null); setOtpSent(false) }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    authMode === mode
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {mode === 'password' ? 'Password' : 'OTP Login'}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              {authMode === 'password' ? (
                <>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button type="button" onClick={() => setShowPassword(p => !p)}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <div className="flex justify-end">
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" loading={loading} className="w-full">
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  {otpSent ? (
                    <>
                      <Input
                        label="OTP Code"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        value={otpToken}
                        onChange={e => setOtpToken(e.target.value)}
                        maxLength={6}
                      />
                      <Button type="button" onClick={handleVerifyOTP} loading={loading} className="w-full">
                        Verify OTP
                      </Button>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="w-full text-xs text-[var(--text-muted)] hover:text-primary-600"
                      >
                        Resend OTP
                      </button>
                    </>
                  ) : (
                    <Button type="button" onClick={handleSendOTP} loading={loading} className="w-full">
                      Send OTP
                    </Button>
                  )}
                </>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--border-color)]" />
              <span className="text-xs text-[var(--text-muted)]">or continue with</span>
              <div className="flex-1 h-px bg-[var(--border-color)]" />
            </div>

            {/* Google */}
            <Button
              variant="secondary"
              className="w-full"
              loading={googleLoading}
              onClick={handleGoogleLogin}
              leftIcon={<Globe className="w-4 h-4" />}
            >
              Continue with Google
            </Button>

            <p className="text-center text-sm text-[var(--text-muted)] mt-5">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary-600 font-semibold hover:text-primary-700">
                Create one free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
