import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, Globe } from 'lucide-react'
import { authService } from '../../services/api'
import Button from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { ROLES } from '../../constants'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  role: z.enum(['citizen', 'mp', 'officer']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const roleOptions = [
  { value: 'citizen', label: '👤 Citizen' },
  { value: 'mp', label: '🏛️ Member of Parliament (MP)' },
  { value: 'officer', label: '👔 Department Officer' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'citizen' },
  })

  const onSubmit = async (data) => {
    setError(null)
    setLoading(true)
    try {
      await authService.signUp(data)
      setSuccess(true)
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await authService.signInWithGoogle()
    } catch (e) {
      setError(e.message)
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">
            Account Created!
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            We've sent a confirmation email. Please verify your email before signing in.
          </p>
          <Link to="/auth/login">
            <Button className="w-full">Go to Sign In</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                PP
              </div>
            </Link>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Create an account</h1>
            <p className="text-sm text-[var(--text-secondary)]">Join People's Priorities — it's free</p>
          </div>

          <div className="card p-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Rajesh Kumar"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.full_name?.message}
                required
                {...register('full_name')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                required
                {...register('email')}
              />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="9876543210"
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone?.message}
                hint="10-digit Indian mobile number"
                required
                {...register('phone')}
              />
              <Select
                label="Register As"
                options={roleOptions}
                error={errors.role?.message}
                required
                {...register('role')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                required
                {...register('password')}
              />
              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                required
                {...register('confirmPassword')}
              />

              <p className="text-xs text-[var(--text-muted)]">
                By registering, you agree to our{' '}
                <span className="text-primary-600 cursor-pointer hover:underline">Terms of Service</span>{' '}
                and{' '}
                <span className="text-primary-600 cursor-pointer hover:underline">Privacy Policy</span>
              </p>

              <Button type="submit" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--border-color)]" />
              <span className="text-xs text-[var(--text-muted)]">or</span>
              <div className="flex-1 h-px bg-[var(--border-color)]" />
            </div>

            <Button
              variant="secondary"
              className="w-full"
              loading={googleLoading}
              onClick={handleGoogle}
              leftIcon={<Globe className="w-4 h-4" />}
            >
              Continue with Google
            </Button>

            <p className="text-center text-sm text-[var(--text-muted)] mt-5">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
