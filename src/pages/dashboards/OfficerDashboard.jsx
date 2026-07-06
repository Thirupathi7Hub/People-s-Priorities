import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, FolderKanban, ArrowRight, Award, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { formatRelativeTime } from '../../utils'
import { useAuth } from '../../contexts/AuthContext'
import { complaintService } from '../../services/api'
import { useState, useEffect } from 'react'

export default function OfficerDashboard() {
  const { user, profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] || 'Officer'
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = user?.uid || user?.id
    if (!uid) return

    let active = true
    setLoading(true)

    complaintService.getAssigned(uid)
      .then(res => {
        if (!active) return
        setComplaints(res.data || [])
      })
      .catch(err => console.error('Failed to load assigned complaints:', err))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  const totalAssigned = complaints.length
  const pendingCount = complaints.filter(c => c.status === 'pending').length
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length
  const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  const resolutionRate = totalAssigned === 0 ? 0 : Math.round((resolvedCount / totalAssigned) * 100)

  // Category chart data
  const categoryCounts = {}
  complaints.forEach(c => {
    const cat = c.categories?.name || c.category || 'Other'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const chartData = Object.keys(categoryCounts).map(name => ({
    name,
    Issues: categoryCounts[name]
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Officer Dashboard — {firstName}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Department: {profile?.department || 'Civil Solver'} · Handle your assigned duties
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{totalAssigned}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Total Assigned</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{pendingCount}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Pending</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center mb-3">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{inProgressCount}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">In Progress</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)]">{resolvedCount}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Resolved</div>
          </div>
        </motion.div>
      </div>

      {/* Personal Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-l-4 border-emerald-500 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500 animate-bounce" />
            <CardTitle>Personal Performance Stats</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Circular progress background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="var(--border-color)" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="54" stroke="#10b981" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - resolutionRate / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-[var(--text-primary)]">{resolutionRate}%</span>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium">Resolution Rate</p>
              </div>
            </div>
            <div className="w-full text-center space-y-1">
              <p className="text-xs font-semibold text-[var(--text-secondary)]">Excellent Work, {firstName}!</p>
              <p className="text-[10px] text-[var(--text-muted)]">
                You resolved {resolvedCount} out of {totalAssigned} assigned complaints.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assigned Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-[var(--text-secondary)] text-sm">
                No active complaints to display charts.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="Issues" fill="#6366f1" radius={[4, 4, 0, 0]} name="Issues Assigned" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assigned complaints table/list */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Complaints list</CardTitle>
          <Link to="/dashboard/officer/complaints" className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all assigned <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                Loading assigned complaints...
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                No complaints currently assigned to you. Good job!
              </div>
            ) : (
              complaints.map((c, i) => (
                <Link key={c.id} to={`/dashboard/officer/complaints/${c.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-5 py-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-2">
                        <span>{c.categories?.name || c.category || 'Other'}</span>
                        <span>·</span>
                        <span>{c.location_text || c.location || 'Constituency'}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(c.created_at)}</span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={c.status} />
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
