import { motion } from 'framer-motion'
import { FolderKanban, MapPin, Calendar, Wallet, ArrowRight } from 'lucide-react'
import { StatusBadge } from '../components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { formatCurrency, formatDate } from '../utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockProjects = [
  { id: 1, title: 'NH-48 Expansion Phase 2', status: 'ongoing', department: 'PWD', location: 'Delhi-Gurugram Corridor', budget: 12000000, spent: 7800000, start_date: '2023-06-01', end_date: '2025-12-31', completion: 65 },
  { id: 2, title: 'District Hospital Renovation', status: 'approved', department: 'Health', location: 'Central District', budget: 5500000, spent: 1100000, start_date: '2024-01-15', end_date: '2025-06-30', completion: 20 },
  { id: 3, title: 'Smart Water Grid Phase 2', status: 'proposed', department: 'Water Authority', location: 'North Zone', budget: 8000000, spent: 0, start_date: null, end_date: null, completion: 0 },
  { id: 4, title: 'Rural School Digitization', status: 'ongoing', department: 'Education', location: 'Multiple Villages', budget: 3200000, spent: 1440000, start_date: '2023-09-01', end_date: '2024-12-31', completion: 45 },
  { id: 5, title: 'Solar Street Lighting', status: 'completed', department: 'Electricity Board', location: 'Sector 12-18', budget: 1800000, spent: 1720000, start_date: '2023-01-01', end_date: '2023-12-31', completion: 100 },
]

const budgetData = mockProjects.map(p => ({
  name: p.title.split(' ').slice(0, 2).join(' '),
  allocated: Math.round(p.budget / 100000),
  spent: Math.round(p.spent / 100000),
}))

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Projects</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{mockProjects.length} projects in constituency</p>
      </div>

      {/* Budget Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Expenditure (₹ Lakhs)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="allocated" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Allocated (L)" />
              <Bar dataKey="spent" fill="#6366f1" radius={[4, 4, 0, 0]} name="Spent (L)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projects list */}
      <div className="space-y-4">
        {mockProjects.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/30 dark:to-violet-950/30 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{p.title}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
                    <span>{p.department}</span>
                    {p.start_date && (
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.start_date)}</span>
                    )}
                  </div>
                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-violet-500 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${p.completion}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] w-10 text-right">{p.completion}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(p.budget)}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">Total Budget</div>
                  <div className="text-xs text-amber-600 mt-1">{formatCurrency(p.spent)} spent</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
