import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Shield, BarChart3, MapPin, Users, FileText,
  Zap, Globe, TrendingUp, CheckCircle, Star, ChevronRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { CATEGORIES, MOCK_STATS } from '../../constants'
import { formatNumber } from '../../utils'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const features = [
  {
    icon: FileText,
    title: 'Submit & Track Complaints',
    desc: 'File complaints with photos, GPS location, and documents. Track real-time status updates from your constituency representatives.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Insights',
    desc: 'Powerful analytics dashboards with charts and visualizations. MPs and officers can make informed decisions backed by data.',
    color: 'from-primary-500 to-violet-500',
  },
  {
    icon: MapPin,
    title: 'Interactive Map View',
    desc: 'Visualize complaints and projects on interactive maps. Understand geographic distribution of issues across your constituency.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Secure access for Citizens, MPs, Department Officers, and Admins. Each role sees relevant data and actions.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    desc: 'Vote on issues, comment on complaints, and collectively prioritize problems that affect your community.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'AI-Ready Architecture',
    desc: 'Built with AI integration in mind. Smart categorization, priority detection, and predictive analytics coming in Phase 2.',
    color: 'from-purple-500 to-indigo-500',
  },
]

const stats = [
  { label: 'Complaints Resolved', value: MOCK_STATS.resolvedComplaints, suffix: '+' },
  { label: 'Active Projects', value: MOCK_STATS.activeProjects, suffix: '' },
  { label: 'Citizens Served', value: MOCK_STATS.citizens, suffix: '+' },
  { label: 'Constituencies', value: MOCK_STATS.constituencies, suffix: '' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Citizen, Mumbai',
    quote: 'I filed a complaint about our broken road and it was fixed within 2 weeks. The tracking feature kept me informed throughout.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'MP, Delhi North',
    quote: "The analytics dashboard gives me a clear picture of my constituency's needs. I can prioritize better than ever before.",
    rating: 5,
  },
  {
    name: 'Anita Patel',
    role: 'Dept. Officer, Pune',
    quote: 'Managing assigned complaints is much easier. The workflow is smooth and updates reach citizens automatically.',
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-app py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
            >
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Platform — Foundation Phase
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--text-primary)] leading-tight mb-6"
            >
              Empower Your{' '}
              <span className="gradient-text">Constituency</span>
              <br />
              Shape Tomorrow
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10"
            >
              A transparent governance platform where citizens voice issues, MPs track priorities,
              and departments execute solutions — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="secondary" size="lg">
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              {['🔒 Secure & Private', '📱 Mobile First', '🌐 Multi-language', '🆓 Free for Citizens'].map(b => (
                <span key={b} className="text-xs text-[var(--text-muted)] flex items-center gap-1">{b}</span>
              ))}
            </motion.div>
          </div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-2xl bg-[var(--bg-card)]">
              <div className="h-8 bg-[var(--bg-tertiary)] flex items-center gap-2 px-4">
                <div className="flex gap-1.5">
                  {['bg-red-400', 'bg-amber-400', 'bg-green-400'].map(c => (
                    <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
                  ))}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[var(--bg-card)] rounded-md px-3 py-0.5 text-xs text-[var(--text-muted)] w-64 mx-auto text-center">
                    peoples-priorities.gov.in
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="card p-4 text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {formatNumber(s.value)}{s.suffix}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold gradient-text">
                  {formatNumber(s.value)}{s.suffix}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-app">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
              Everything You Need for{' '}
              <span className="gradient-text">Effective Governance</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              A comprehensive suite of tools for citizens, representatives, and government departments.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="card p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container-app">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
              Issue <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-[var(--text-secondary)]">Submit complaints across all areas of civic concern</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} {...fadeUp} transition={{ delay: i * 0.05 }}>
                <div className="card p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2"
                    style={{ background: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] leading-tight">{cat.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-app">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
              Trusted by <span className="gradient-text">Communities</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}>
                <div className="card p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] italic mb-4">"{t.quote}"</p>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-app">
          <motion.div {...fadeUp}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 p-10 md:p-16 text-center text-white">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Start Making a Difference Today
                </h2>
                <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                  Join thousands of citizens who are already shaping their communities through transparent governance.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/auth/register">
                    <Button
                      size="lg"
                      className="bg-white text-primary-700 hover:bg-white/90 shadow-xl"
                    >
                      Register as Citizen
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white border border-white/30 hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
