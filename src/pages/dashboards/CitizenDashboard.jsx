import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, CheckCircle, Clock, TrendingUp, Plus, MapPin,
  Bell, ArrowRight, ThumbsUp, MessageSquare, Eye
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { complaintService } from '../../services/api'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { formatRelativeTime, formatDate } from '../../utils'
import { CHART_COLORS, STATUS_CONFIG, CATEGORIES } from '../../constants'

function StatCard({ icon: Icon, label, value, change, color, to }) {
  const Wrapper = to ? Link : 'div'
  return (
    <Wrapper to={to}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {change && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <div className="text-2xl font-extrabold text-[var(--text-primary)]">{value}</div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
      </motion.div>
    </Wrapper>
  )
}

export default function CitizenDashboard() {
  const { user, profile } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Citizen'

  useEffect(() => {
    let active = true
    const userId = user?.uid || user?.id
    if (!userId) {
      setLoading(false)
      return
    }

    complaintService.getMine(userId)
      .then(res => {
        if (!active) return
        setComplaints(res.data || [])
      })
      .catch(err => {
        console.error('Failed to fetch citizen complaints:', err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  const totalCount = complaints.length
  const pendingCount = complaints.filter(c => c.status === 'pending').length
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length
  const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length

  // Build category chart data dynamically
  const categoryCounts = {}
  complaints.forEach(c => {
    const categoryName = c.categories?.name || c.category || 'Other'
    categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
  })
  
  const categoryData = Object.keys(categoryCounts).map(name => {
    const count = categoryCounts[name]
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    const catObj = CATEGORIES.find(cat => cat.name === name)
    return {
      name,
      value: percentage,
      color: catObj ? catObj.color : '#8b5cf6'
    }
  })

  const finalCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'No Data', value: 100, color: '#6b7280' }
  ]

  // Build monthly activity dynamically (last 6 months)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const last6Months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = months[d.getMonth()]
    last6Months.push({ month: monthName, complaints: 0, resolved: 0 })
  }

  complaints.forEach(c => {
    if (!c.created_at) return
    const date = new Date(c.created_at)
    const monthName = months[date.getMonth()]
    const matched = last6Months.find(m => m.month === monthName)
    if (matched) {
      matched.complaints += 1
      if (c.status === 'resolved' || c.status === 'closed') {
        matched.resolved += 1
      }
    }
  })

  const recentComplaints = complaints.slice(0, 4)

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]"
          >
            Welcome back, {firstName} 👋
          </motion.h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {formatDate(new Date())} · Your voice matters
          </p>
        </div>
        <Link to="/dashboard/citizen/complaints/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Complaints" value={totalCount} color="from-blue-500 to-cyan-500" to="/dashboard/citizen/complaints" />
        <StatCard icon={Clock} label="Pending" value={pendingCount} color="from-amber-500 to-orange-500" to="/dashboard/citizen/complaints?status=pending" />
        <StatCard icon={TrendingUp} label="In Progress" value={inProgressCount} color="from-primary-500 to-violet-500" to="/dashboard/citizen/complaints?status=in_progress" />
        <StatCard icon={CheckCircle} label="Resolved" value={resolvedCount} color="from-green-500 to-emerald-500" to="/dashboard/citizen/complaints?status=resolved" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Activity</CardTitle>
              <Badge color="muted">Last 6 months</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={last6Months} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="complaintGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="complaints" stroke="#6366f1" fill="url(#complaintGrad)" strokeWidth={2} name="Submitted" />
                  <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#resolvedGrad)" strokeWidth={2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={finalCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {finalCategoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {finalCategoryData.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-[var(--text-secondary)]">{c.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--text-primary)]">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Complaints</CardTitle>
          <Link to="/dashboard/citizen/complaints" className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {recentComplaints.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                No complaints submitted yet. Click "New Complaint" to report your first issue.
              </div>
            ) : (
              recentComplaints.map((c, i) => {
                const categoryName = c.categories?.name || c.category || 'Other'
                return (
                  <Link key={c.id} to={`/dashboard/citizen/complaints/${c.id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="px-5 py-4 flex items-start gap-4 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                          <span>{categoryName}</span>
                          <span>·</span>
                          <span>{formatRelativeTime(c.created_at)}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <ThumbsUp className="w-3 h-3" />
                          {c.upvotes || 0}
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                    </motion.div>
                  </Link>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Plus, label: 'Submit Complaint', desc: 'Report a new issue in your area', to: '/dashboard/citizen/complaints/new', color: 'from-primary-500 to-violet-500' },
          { icon: MapPin, label: 'View Map', desc: 'See complaints near you on map', to: '/dashboard/citizen/map', color: 'from-rose-500 to-pink-500' },
          { icon: Bell, label: 'Notifications', desc: 'Check your updates and alerts', to: '/dashboard/citizen/notifications', color: 'from-amber-500 to-orange-500' },
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
