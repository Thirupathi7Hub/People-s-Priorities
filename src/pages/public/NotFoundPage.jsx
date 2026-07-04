import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-extrabold gradient-text mb-6">404</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => history.back()}>
            <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>Go Back</Button>
          </button>
          <Link to="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
