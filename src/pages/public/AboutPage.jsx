import { motion } from 'framer-motion'
import { Shield, Users, Globe, Target, Award, Zap } from 'lucide-react'

const team = [
  { name: 'Dr. Arun Sharma', role: 'Product Vision', emoji: '🏛️' },
  { name: 'Priya Nambiar', role: 'UX Lead', emoji: '🎨' },
  { name: 'Rahul Singh', role: 'Tech Lead', emoji: '💻' },
  { name: 'Meera Iyer', role: 'Data Science', emoji: '📊' },
]

const values = [
  { icon: Shield, title: 'Transparency', desc: 'Every action, every rupee — visible to citizens.', color: 'from-blue-500 to-cyan-500' },
  { icon: Users, title: 'Inclusivity', desc: 'Designed for every citizen, in every corner of India.', color: 'from-primary-500 to-violet-500' },
  { icon: Target, title: 'Accountability', desc: 'Track promises. Measure outcomes. Hold accountable.', color: 'from-rose-500 to-pink-500' },
  { icon: Zap, title: 'Innovation', desc: 'AI-ready infrastructure for the governance of tomorrow.', color: 'from-amber-500 to-orange-500' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container-app max-w-3xl">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              🇮🇳 For the People, By the People
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6">
              Reimagining <span className="gradient-text">Democratic Participation</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              People's Priorities is a government initiative to bridge the gap between citizens and their
              elected representatives through technology, transparency, and data-driven governance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="container-app max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-4">Our Mission</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We believe that effective governance starts with listening. Our platform creates a
                two-way channel between citizens and their representatives, ensuring no voice goes unheard.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                By combining complaint management, project tracking, and budget transparency with
                AI-powered insights, we're building the governance infrastructure for Digital India.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'States Covered', value: '28+' },
                  { label: 'Constituencies', value: '48' },
                  { label: 'Citizens Served', value: '2.8L+' },
                  { label: 'Issues Resolved', value: '9,203' },
                ].map((s, i) => (
                  <div key={i} className="card p-5 text-center">
                    <div className="text-2xl font-extrabold gradient-text">{s.value}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container-app">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="card p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mx-auto mb-4`}>
                    <v.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{v.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="container-app max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">The Team</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="card p-5 text-center">
                  <div className="text-4xl mb-3">{t.emoji}</div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
