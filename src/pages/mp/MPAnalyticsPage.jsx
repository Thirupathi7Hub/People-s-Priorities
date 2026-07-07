import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, PieChart as PieIcon, Activity
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { complaintService } from '../../services/api'
import { CATEGORIES } from '../../constants'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function MPAnalyticsPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    complaintService.getAll()
      .then(res => { if (!active) return; setComplaints(res.data || []) })
      .catch(err => console.error(err))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) return <PageSkeleton />

  const total = complaints.length
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  const inProgress = complaints.filter(c => c.status === 'in_progress').length
  const pending = complaints.filter(c => c.status === 'pending').length
  const open = complaints.filter(c => c.status === 'open').length

  // Category breakdown
  const catMap = {}
  complaints.forEach(c => {
    const name = c.categories?.name || c.category || 'Other'
    catMap[name] = catMap[name] || { name, total: 0, resolved: 0, pending: 0 }
    catMap[name].total += 1
    if (c.status === 'resolved' || c.status === 'closed') catMap[name].resolved += 1
    else catMap[name].pending += 1
  })
  const catData = Object.values(catMap)

  // Priority breakdown
  const priorityMap = { critical: 0, high: 0, medium: 0, low: 0 }
  complaints.forEach(c => { if (priorityMap[c.priority] !== undefined) priorityMap[c.priority] += 1 })
  const priorityData = [
    { name: 'Critical', value: priorityMap.critical, color: '#ef4444' },
    { name: 'High', value: priorityMap.high, color: '#f97316' },
    { name: 'Medium', value: priorityMap.medium, color: '#eab308' },
    { name: 'Low', value: priorityMap.low, color: '#22c55e' },
  ].filter(p => p.value > 0)

  // Status pie
  const statusData = [
    { name: 'Resolved', value: resolved, color: '#22c55e' },
    { name: 'In Progress', value: inProgress, color: '#6366f1' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Open', value: open, color: '#3b82f6' },
  ].filter(s => s.value > 0)

  // Monthly trend (last 6 months)
  const now = new Date()
  const last6 = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    last6.push({ month: MONTHS[d.getMonth()], submitted: 0, resolved: 0 })
  }
  complaints.forEach(c => {
    if (!c.created_at) return
    const mName = MONTHS[new Date(c.created_at).getMonth()]
    const found = last6.find(m => m.month === mName)
    if (found) {
      found.submitted += 1
      if (c.status === 'resolved' || c.status === 'closed') found.resolved += 1
    }
  })

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  if (total === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Category-wise analysis and resolution trends</p>
        </div>
        <Card>
          <CardContent className="p-16 text-center text-[var(--text-secondary)]">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-lg">No data yet</p>
            <p className="text-sm mt-1">Analytics will appear once citizens submit complaints.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Category-wise analysis and resolution trends</p>
        </div>
        <Badge color="primary">{total} Total Complaints</Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total, color: 'from-blue-500 to-cyan-500' },
          { label: 'Resolved', value: resolved, color: 'from-green-500 to-emerald-500' },
          { label: 'In Progress', value: inProgress, color: 'from-primary-500 to-violet-500' },
          { label: 'Resolution %', value: `${resolutionRate}%`, color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="card p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status + Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[var(--text-secondary)]">{s.name}</span>
                  <span className="font-bold text-[var(--text-primary)] ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Priority Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Complaints">
                  {priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category-wise bar */}
      {catData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category-wise Analysis</CardTitle>
            <Badge color="muted">Resolved vs Pending</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={catData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
          <Badge color="muted">Last 6 months</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={last6} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="submitted" stroke="#6366f1" strokeWidth={2} dot={false} name="Submitted" />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={false} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
