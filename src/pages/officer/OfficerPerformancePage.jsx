import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle, Clock, TrendingUp, Star, Award, Target, Zap, BarChart3
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { useAuth } from '../../contexts/AuthContext'
import { complaintService } from '../../services/api'
import { formatDate } from '../../utils'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function OfficerPerformancePage() {
  const { user, profile } = useAuth()
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
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  const inProgress = complaints.filter(c => c.status === 'in_progress').length
  const pending = complaints.filter(c => c.status === 'pending' || c.status === 'open').length
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  // Monthly resolution trend (last 6 months)
  const now = new Date()
  const last6 = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    last6.push({ month: MONTHS[d.getMonth()], resolved: 0, assigned: 0 })
  }
  complaints.forEach(c => {
    if (!c.created_at) return
    const date = new Date(c.created_at)
    const mName = MONTHS[date.getMonth()]
    const found = last6.find(m => m.month === mName)
    if (found) {
      found.assigned += 1
      if (c.status === 'resolved' || c.status === 'closed') found.resolved += 1
    }
  })

  // Category breakdown
  const catMap = {}
  complaints.forEach(c => {
    const name = c.categories?.name || c.category || 'Other'
    catMap[name] = (catMap[name] || 0) + 1
  })
  const catData = Object.entries(catMap).map(([name, count]) => ({ name, count })).slice(0, 6)

  const radialData = [
    { name: 'Resolution Rate', value: resolutionRate, fill: '#22c55e' },
  ]

  const performanceScore = Math.min(100, Math.round(
    (resolutionRate * 0.6) + (inProgress > 0 ? 30 : 0) + (total > 5 ? 10 : 0)
  ))

  const grade = performanceScore >= 90 ? 'Excellent' :
                performanceScore >= 70 ? 'Good' :
                performanceScore >= 50 ? 'Average' : 'Needs Improvement'
  const gradeColor = performanceScore >= 90 ? 'success' :
                     performanceScore >= 70 ? 'primary' :
                     performanceScore >= 50 ? 'warning' : 'danger'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Performance Stats
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {profile?.full_name || 'Officer'} · {formatDate(new Date())}
          </p>
        </div>
        <Badge color={gradeColor} className="text-sm px-3 py-1.5 font-bold">
          <Award className="w-3.5 h-3.5 mr-1.5" />
          {grade}
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: 'Total Assigned', value: total, color: 'from-blue-500 to-cyan-500' },
          { icon: Clock, label: 'Pending / Open', value: pending, color: 'from-amber-500 to-orange-500' },
          { icon: TrendingUp, label: 'In Progress', value: inProgress, color: 'from-primary-500 to-violet-500' },
          { icon: CheckCircle, label: 'Resolved', value: resolved, color: 'from-green-500 to-emerald-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="card p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Score + Monthly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Radial */}
        <Card>
          <CardHeader><CardTitle>Resolution Rate</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="60%" outerRadius="90%"
                data={radialData}
                startAngle={90} endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-4">
              <div className="text-4xl font-extrabold text-[var(--text-primary)]">{resolutionRate}%</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">of complaints resolved</div>
            </div>
            <div className="mt-4 w-full space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Performance Score</span>
                <span className="font-bold text-[var(--text-primary)]">{performanceScore}/100</span>
              </div>
              <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${performanceScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <Badge color="muted">Last 6 months</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={last6} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="assigned" stroke="#6366f1" strokeWidth={2} dot={false} name="Assigned" />
                  <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={false} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Breakdown */}
      {catData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cases by Category</CardTitle>
            <Zap className="w-4 h-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {catData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-[var(--text-secondary)]">
            <Target className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No performance data yet</p>
            <p className="text-sm mt-1">Start resolving assigned complaints to see your stats here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
