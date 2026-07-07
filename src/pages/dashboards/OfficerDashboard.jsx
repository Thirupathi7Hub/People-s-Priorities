import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, CheckCircle, Clock, TrendingUp, ArrowRight,
  UploadCloud, Flag, StickyNote
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { formatRelativeTime } from '../../utils'
import { useAuth } from '../../contexts/AuthContext'
import { complaintService } from '../../services/api'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function OfficerDashboard() {
  const { profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] || 'Officer'

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    complaintService.getAll()
      .then(res => {
        if (!active) return
        setComplaints(res.data || [])
      })
      .catch(err => console.error(err))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) return <PageSkeleton />

  const total = complaints.length
  const pending = complaints.filter(c => c.status === 'pending' || c.status === 'open').length
  const inProgress = complaints.filter(c => c.status === 'in_progress').length
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length

  // Build last 6 months data
  const now = new Date()
  const last6 = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    last6.push({ month: MONTHS[d.getMonth()], assigned: 0, resolved: 0 })
  }
  complaints.forEach(c => {
    if (!c.created_at) return
    const mName = MONTHS[new Date(c.created_at).getMonth()]
    const found = last6.find(m => m.month === mName)
    if (found) {
      found.assigned += 1
      if (c.status === 'resolved' || c.status === 'closed') found.resolved += 1
    }
  })

  const recentCases = complaints
    .filter(c => c.status !== 'resolved' && c.status !== 'closed')
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Solver Dashboard — {firstName}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Resolve assigned complaints efficiently</p>
        </div>
        <Link to="/dashboard/officer/complaints">
          <Button size="sm" leftIcon={<FileText className="w-4 h-4" />}>View All Cases</Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Assigned', value: total, color: 'from-blue-500 to-cyan-500', to: '/dashboard/officer/complaints' },
          { icon: Clock, label: 'Pending / Open', value: pending, color: 'from-amber-500 to-orange-500', to: '/dashboard/officer/update' },
          { icon: TrendingUp, label: 'In Progress', value: inProgress, color: 'from-primary-500 to-violet-500', to: '/dashboard/officer/complaints' },
          { icon: CheckCircle, label: 'Resolved', value: resolved, color: 'from-green-500 to-emerald-500', to: '/dashboard/officer/performance' },
        ].map((s, i) => (
          <Link key={i} to={s.to}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last6} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} name="Assigned" />
              <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Open Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Open / Pending Cases</CardTitle>
          <Link to="/dashboard/officer/complaints" className="text-xs text-primary-600 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {recentCases.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-60" />
                All caught up! No open cases remaining.
              </div>
            ) : (
              recentCases.map((c, i) => (
                <Link key={c.id} to={`/dashboard/officer/complaints/${c.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      c.priority === 'critical' ? 'bg-red-500' :
                      c.priority === 'high' ? 'bg-orange-500' :
                      c.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {c.citizen_name || 'Citizen'} · {formatRelativeTime(c.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Assigned Cases', desc: 'View all your assigned complaints', to: '/dashboard/officer/complaints', color: 'from-blue-500 to-cyan-500' },
          { icon: CheckCircle, label: 'Update Status', desc: 'Mark issues resolved or in-progress', to: '/dashboard/officer/update', color: 'from-green-500 to-emerald-500' },
          { icon: TrendingUp, label: 'My Performance', desc: 'View your resolution stats', to: '/dashboard/officer/performance', color: 'from-primary-500 to-violet-500' },
        ].map((action, i) => (
          <Link key={i} to={action.to}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{action.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
