import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, CheckCircle, Clock, Users, TrendingUp, Wallet,
  ArrowRight, AlertTriangle, FolderKanban, BarChart3
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatCurrency, formatDate } from '../../utils'
import { CHART_COLORS } from '../../constants'
import { useAuth } from '../../contexts/AuthContext'

import { complaintService } from '../../services/api'
import { useState, useEffect } from 'react'

const mockStats = [
  { icon: FileText, label: 'Total Complaints', value: '1,284', change: 12, color: 'from-blue-500 to-cyan-500' },
  { icon: CheckCircle, label: 'Resolved This Month', value: '342', change: 8, color: 'from-green-500 to-emerald-500' },
  { icon: FolderKanban, label: 'Active Projects', value: '18', change: 5, color: 'from-primary-500 to-violet-500' },
  { icon: Wallet, label: 'Budget Utilized', value: '68%', change: -3, color: 'from-amber-500 to-orange-500' },
]

const categoryData = [
  { name: 'Roads', pending: 45, resolved: 120, in_progress: 30 },
  { name: 'Water', pending: 30, resolved: 89, in_progress: 20 },
  { name: 'Power', pending: 25, resolved: 67, in_progress: 15 },
  { name: 'Health', pending: 18, resolved: 45, in_progress: 12 },
  { name: 'Education', pending: 12, resolved: 38, in_progress: 8 },
  { name: 'Sanitation', pending: 20, resolved: 56, in_progress: 18 },
]

const radarData = [
  { category: 'Infrastructure', A: 120 },
  { category: 'Healthcare', A: 80 },
  { category: 'Education', A: 60 },
  { category: 'Water', A: 100 },
  { category: 'Environment', A: 45 },
  { category: 'Employment', A: 70 },
]

const priorityProjects = [
  { name: 'National Highway 48 Expansion', status: 'ongoing', budget: 12000000, completion: 65 },
  { name: 'District Hospital Renovation', status: 'approved', budget: 5500000, completion: 20 },
  { name: 'Smart Water Grid Phase 2', status: 'proposed', budget: 8000000, completion: 0 },
  { name: 'Rural School Digitization', status: 'ongoing', budget: 3200000, completion: 45 },
]

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div className="text-2xl font-extrabold text-[var(--text-primary)]">{value}</div>
      <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
    </motion.div>
  )
}

export default function MPDashboard() {
  const { profile, user } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] || 'Minister'
  const [stats, setStats] = useState(mockStats)
  const [categoryStats, setCategoryStats] = useState(categoryData)

  useEffect(() => {
    complaintService.getAll()
      .then(res => {
        const dbList = res.data || []
        if (dbList.length > 0) {
          const dbCount = dbList.length
          setStats(prev => prev.map(s => {
            if (s.label === 'Total Complaints') {
              return { ...s, value: (1284 + dbCount).toLocaleString() }
            }
            return s
          }))

          const counts = dbList.reduce((acc, c) => {
            const cat = c.categories?.name || c.category || 'Other'
            const key = cat.startsWith('Roads') ? 'Roads' : cat.startsWith('Water') ? 'Water' : cat.startsWith('Power') || cat.startsWith('Electricity') ? 'Power' : cat.startsWith('Health') ? 'Health' : cat.startsWith('Education') ? 'Education' : cat.startsWith('Sanitation') ? 'Sanitation' : 'Other'
            acc[key] = (acc[key] || 0) + 1
            return acc
          }, {})

          setCategoryStats(prev => prev.map(cat => {
            const dbPending = counts[cat.name] || 0
            return {
              ...cat,
              pending: cat.pending + dbPending
            }
          }))
        }
      })
      .catch(err => console.error('Failed to load stats:', err))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            MP Dashboard — {firstName}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {formatDate(new Date())} · Constituency Overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/mp/reports">
            <Button variant="secondary" leftIcon={<BarChart3 className="w-4 h-4" />} size="sm">
              Generate Report
            </Button>
          </Link>
          <Link to="/dashboard/mp/projects">
            <Button leftIcon={<FolderKanban className="w-4 h-4" />} size="sm">
              View Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
            <Badge color="muted">This Month</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryStats} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                <Bar dataKey="in_progress" fill="#6366f1" radius={[4, 4, 0, 0]} name="In Progress" />
                <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Priority Radar</CardTitle>
            <Badge color="muted">Constituency</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Radar name="Issues" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Priority Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Projects</CardTitle>
          <Link to="/dashboard/mp/projects" className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {priorityProjects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="px-5 py-4 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{p.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Budget: {formatCurrency(p.budget)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-violet-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${p.completion}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)] w-10 text-right">{p.completion}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: '₹4.56 Cr', icon: Wallet, color: 'bg-primary-100 dark:bg-primary-950/30 text-primary-600' },
          { label: 'Spent', value: '₹3.10 Cr', icon: TrendingUp, color: 'bg-amber-100 dark:bg-amber-950/30 text-amber-600' },
          { label: 'Remaining', value: '₹1.46 Cr', icon: AlertTriangle, color: 'bg-green-100 dark:bg-green-950/30 text-green-600' },
        ].map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${b.color} flex items-center justify-center`}>
                <b.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-[var(--text-primary)]">{b.value}</p>
                <p className="text-xs text-[var(--text-muted)]">{b.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
