import { motion } from 'framer-motion'
import { FileText, BarChart3, MapPin, Shield, Users, Zap, Bell, Upload, Vote, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

const features = [
  { icon: FileText, title: 'Smart Complaint Filing', desc: 'File complaints with photos, videos, GPS location, and documents. AI categorization coming in Phase 2.', color: 'from-blue-500 to-cyan-500', items: ['Photo/Video Upload', 'GPS Location Capture', 'PDF Attachments', 'Anonymous Submission'] },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Comprehensive dashboards with charts, trends, and insights for every user role.', color: 'from-primary-500 to-violet-500', items: ['Pie & Bar Charts', 'Area & Line Charts', 'Radar Charts', 'Export Reports'] },
  { icon: MapPin, title: 'Interactive Maps', desc: 'Visualize complaints, projects, and villages on interactive Leaflet maps.', color: 'from-rose-500 to-pink-500', items: ['Complaint Markers', 'Project Locations', 'Status Color Coding', 'Filter by Category'] },
  { icon: Shield, title: 'Role-Based Access', desc: 'Secure, role-specific dashboards for Citizens, MPs, Officers, and Administrators.', color: 'from-amber-500 to-orange-500', items: ['4 User Roles', 'Protected Routes', 'RLS Policies', 'Google & OTP Login'] },
  { icon: Users, title: 'Community Features', desc: 'Vote on issues, comment on complaints, and collectively prioritize community problems.', color: 'from-green-500 to-emerald-500', items: ['Upvote/Downvote', 'Comment Threads', 'Community Rankings', 'Share Complaints'] },
  { icon: Zap, title: 'AI-Ready Architecture', desc: 'Built for seamless AI integration in Phase 2: smart categorization, priority detection, and predictions.', color: 'from-purple-500 to-indigo-500', items: ['Modular Services', 'Edge Functions Ready', 'Structured Data', 'ML Pipeline Hooks'] },
]

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }

export default function FeaturesPage() {
  return (
    <div className="pb-20">
      <section className="py-16 text-center">
        <div className="container-app max-w-3xl">
          <motion.div {...fadeUp}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
              Platform <span className="gradient-text">Features</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Everything you need for modern, participatory governance — built with the latest technology stack.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-app space-y-8">
        {features.map((f, i) => (
          <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}>
            <div className={`card p-6 sm:p-8 flex flex-col ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-8 items-center`}>
              <div className="flex-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-3">{f.title}</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{f.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {f.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className={`w-full sm:w-64 h-48 rounded-2xl bg-gradient-to-br ${f.color} opacity-10 flex items-center justify-center shrink-0`}>
                <f.icon className="w-20 h-20 text-[var(--text-primary)] opacity-20" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="container-app mt-16 text-center">
        <motion.div {...fadeUp}>
          <div className="card p-10 sm:p-16 bg-gradient-to-br from-primary-600 to-violet-700 text-white border-none">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Join thousands of citizens already making a difference through the platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button className="bg-white text-primary-700 hover:bg-white/90 shadow-xl" size="lg">
                  Register Free
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
