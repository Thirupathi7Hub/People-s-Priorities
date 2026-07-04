import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, FolderKanban, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { formatRelativeTime } from '../../utils'
import { useAuth } from '../../contexts/AuthContext'

const assignedComplaints = [
  { id: 1, title: 'Broken water pipe on Civil Lines', status: 'open', priority: 'high', citizen: 'Amita Singh', created_at: '2024-01-15T10:00:00Z' },
  { id: 2, title: 'Transformer failure — Block C', status: 'in_progress', priority: 'critical', citizen: 'Rohit Mehta', created_at: '2024-01-14T14:00:00Z' },
  { id: 3, title: 'Park maintenance request', status: 'pending', priority: 'low', citizen: 'Priya Nair', created_at: '2024-01-13T09:00:00Z' },
  { id: 4, title: 'School building repair needed', status: 'in_progress', priority: 'medium', citizen: 'Arjun Patel', created_at: '2024-01-12T11:00:00Z' },
]

const weeklyData = [
  { day: 'Mon', assigned: 8, resolved: 6 },
  { day: 'Tue', assigned: 12, resolved: 9 },
  { day: 'Wed', assigned: 7, resolved: 7 },
  { day: 'Thu', assigned: 15, resolved: 11 },
  { day: 'Fri', assigned: 10, resolved: 8 },
  { day: 'Sat', assigned: 5, resolved: 5 },
]

export default function OfficerDashboard() {
  const { profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] || 'Officer'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Officer Dashboard — {firstName}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage assigned complaints and projects</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Assigned', value: '47', color: 'from-blue-500 to-cyan-500' },
          { icon: Clock, label: 'Pending', value: '12', color: 'from-amber-500 to-orange-500' },
          { icon: FolderKanban, label: 'In Progress', value: '23', color: 'from-primary-500 to-violet-500' },
          { icon: CheckCircle, label: 'Resolved', value: '156', color: 'from-green-500 to-emerald-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      <Card>
        <CardHeader><CardTitle>Weekly Activity</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} name="Assigned" />
              <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Complaints</CardTitle>
          <Link to="/dashboard/officer/complaints" className="text-xs text-primary-600 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {assignedComplaints.map((c, i) => (
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
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{c.citizen} · {formatRelativeTime(c.created_at)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
