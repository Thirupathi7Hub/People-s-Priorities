import { motion } from 'framer-motion'
import { BarChart3, Download, Calendar } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDate } from '../utils'

const monthlyData = [
  { month: 'Aug', submitted: 320, resolved: 280, in_progress: 40 },
  { month: 'Sep', submitted: 380, resolved: 320, in_progress: 60 },
  { month: 'Oct', submitted: 420, resolved: 380, in_progress: 40 },
  { month: 'Nov', submitted: 510, resolved: 450, in_progress: 60 },
  { month: 'Dec', submitted: 460, resolved: 400, in_progress: 60 },
  { month: 'Jan', submitted: 590, resolved: 510, in_progress: 80 },
]

const categoryMonthly = [
  { month: 'Sep', Roads: 80, Water: 55, Power: 45, Health: 30 },
  { month: 'Oct', Roads: 95, Water: 70, Power: 50, Health: 40 },
  { month: 'Nov', Roads: 110, Water: 85, Power: 60, Health: 45 },
  { month: 'Dec', Roads: 100, Water: 75, Power: 55, Health: 35 },
  { month: 'Jan', Roads: 130, Water: 90, Power: 65, Health: 50 },
]

const savedReports = [
  { title: 'Q3 2024 — Constituency Overview', type: 'Quarterly', date: '2024-10-01', size: '2.4 MB' },
  { title: 'Water Supply Crisis Analysis', type: 'Category', date: '2024-09-15', size: '1.1 MB' },
  { title: 'Budget Utilization H1 2024', type: 'Financial', date: '2024-07-01', size: '3.2 MB' },
  { title: 'Monthly Report — August 2024', type: 'Monthly', date: '2024-09-01', size: '0.8 MB' },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Reports</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Analytics and insights for your constituency</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Export PDF
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Complaints This Month', value: '590', change: '+28%' },
          { label: 'Resolution Rate', value: '86%', change: '+4%' },
          { label: 'Avg. Response Time', value: '3.2 days', change: '-0.8d' },
          { label: 'Citizen Satisfaction', value: '4.2/5', change: '+0.3' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card p-5">
              <div className="text-xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
              <div className={`text-xs mt-1.5 font-medium ${s.change.startsWith('+') ? 'text-green-600' : s.change.startsWith('-') && s.label === 'Avg. Response Time' ? 'text-green-600' : 'text-red-500'}`}>
                {s.change} vs last month
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Complaint Trends</CardTitle>
          <Badge color="muted">Last 6 months</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="submittedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="submitted" stroke="#6366f1" fill="url(#submittedGrad)" strokeWidth={2} name="Submitted" />
              <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#resolvedGradR)" strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryMonthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Roads" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Water" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Power" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="Health" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Saved Reports */}
      <Card>
        <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {savedReports.map((r, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{r.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {r.type} · {formatDate(r.date)} · {r.size}
                  </p>
                </div>
                <button className="btn-ghost p-2 rounded-lg text-[var(--text-muted)] hover:text-primary-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
