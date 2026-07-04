import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { Input, Textarea, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'complaint', label: 'Complaint about Platform' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'media', label: 'Media / Press' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
  }

  const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container-app max-w-2xl">
          <motion.div {...fadeUp}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-app max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <motion.div {...fadeUp} className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'support@peoples-priorities.gov.in', color: 'from-primary-500 to-violet-500' },
              { icon: Phone, label: 'Toll Free', value: '1800-XXX-XXXX', color: 'from-green-500 to-emerald-500' },
              { icon: MapPin, label: 'Office', value: 'New Delhi, India 110001', color: 'from-rose-500 to-pink-500' },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9AM–6PM IST', color: 'from-amber-500 to-orange-500' },
            ].map((c, i) => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">{c.label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{c.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div className="card p-6">
              {sent ? (
                <div className="text-center py-8 space-y-4">
                  <div className="text-5xl">✅</div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Message Sent!</h3>
                  <p className="text-[var(--text-secondary)]">We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setSent(false)} variant="secondary">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <Select
                    label="Subject"
                    options={subjects}
                    placeholder="Select subject"
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    required
                  />
                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required
                  />
                  <Button type="submit" loading={loading} className="w-full" leftIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
