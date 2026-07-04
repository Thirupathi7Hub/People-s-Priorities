import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, FileText, Building2, Tag, FolderKanban, ArrowRight, Shield, Activity } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatRelativeTime } from '../../utils'
import { CHART_COLORS } from '../../constants'

const systemStats = [
  { icon: Users, label: 'Total Users', value: '28,745', change: 5, color: 'from-blue-500 to-cyan-500', to: '/dashboard/admin/users' },
  { icon: FileText, label: 'Total Complaints', value: '12,847', change: 12, color: 'from-primary-500 to-violet-500', to: '/dashboard/admin/complaints' },
  { icon: FolderKanban, label: 'Active Projects', value: '234', change: 3, color: 'from-green-500 to-emerald-500', to: '/dashboard/admin/projects' },
  { icon: Building2, label: 'Departments', value: '18', change: 0, color: 'from-amber-500 to-orange-500', to: '/dashboard/admin/departments' },
]

const growthData = [
  { month: 'Aug', users: 18000, complaints: 8500 },
  { month: 'Sep', users: 20000, complaints: 9200 },
  { month: 'Oct', users: 22500, complaints: 10100 },
  { month: 'Nov', users: 24200, complaints: 11300 },
  { month: 'Dec', users: 26800, complaints: 12100 },
  { month: 'Jan', users: 28745, complaints: 12847 },
]

const roleDistribution = [
  { name: 'Citizens', value: 28100, color: '#6366f1' },
  { name: 'Officers', value: 580, color: '#22c55e' },
  { name: 'MPs', value: 48, color: '#f59e0b' },
  { name: 'Admins', value: 17, color: '#ef4444' },
]

const recentActivity = [
  { user: 'Priya Sharma', action: 'Submitted a complaint about Roads', time: '2024-01-15T10:00:00Z', type: 'complaint' },
  { user: 'Rajesh Kumar MP', action: 'Approved the Water Grid project', time: '2024-01-15T09:30:00Z', type: 'project' },
  { user: 'Admin System', action: 'New department created: Smart City', time: '2024-01-15T09:00:00Z', type: 'admin' },
  { user: 'Officer Mehta', action: 'Resolved complaint #1284 - Roads', time: '2024-01-15T08:45:00Z', type: 'resolve' },
  { user: 'Anita Patel', action: 'Voted on electricity complaint', time: '2024-01-15T08:30:00Z', type: 'vote' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">System-wide overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="success" dot>System Healthy</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((s, i) => (
          <Link key={i} to={s.to}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  {s.change !== 0 && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.change > 0 ? '+' : ''}{s.change}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <Badge color="muted">Last 6 months</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={false} name="Users" />
                  <Line type="monotone" dataKey="complaints" stroke="#ec4899" strokeWidth={2} dot={false} name="Complaints" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>User Roles</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={3} dataKey="value">
                  {roleDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [v.toLocaleString(), '']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {roleDistribution.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    <span className="text-[var(--text-secondary)]">{r.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--text-primary)]">{r.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <Activity className="w-4 h-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border-color)]">
              {recentActivity.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                  className="px-5 py-3 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    a.type === 'complaint' ? 'bg-blue-500' :
                    a.type === 'project' ? 'bg-primary-500' :
                    a.type === 'admin' ? 'bg-amber-500' :
                    a.type === 'resolve' ? 'bg-green-500' : 'bg-pink-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{a.user}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{a.action}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{formatRelativeTime(a.time)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Users', icon: Users, to: '/dashboard/admin/users', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
              { label: 'Departments', icon: Building2, to: '/dashboard/admin/departments', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
              { label: 'Constituencies', icon: Tag, to: '/dashboard/admin/constituencies', color: 'text-primary-600 bg-primary-50 dark:bg-primary-950/30' },
              { label: 'View Reports', icon: Shield, to: '/dashboard/admin/reports', color: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
            ].map((a, i) => (
              <Link key={i} to={a.to}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                  className="card p-4 flex flex-col items-center gap-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
                    <a.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{a.label}</span>
                </motion.div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
