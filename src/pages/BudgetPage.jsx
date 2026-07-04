import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react'
import { PieChart as RPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { formatCurrency } from '../utils'
import { CHART_COLORS } from '../constants'

const budgetData = [
  { dept: 'Infrastructure', allocated: 18000000, spent: 12000000 },
  { dept: 'Health', allocated: 8000000, spent: 5500000 },
  { dept: 'Education', allocated: 6000000, spent: 4200000 },
  { dept: 'Agriculture', allocated: 5000000, spent: 3100000 },
  { dept: 'Environment', allocated: 3000000, spent: 1800000 },
  { dept: 'Other', allocated: 5600000, spent: 3200000 },
]

const pieData = budgetData.map(d => ({ name: d.dept, value: d.allocated }))
const total = budgetData.reduce((a, b) => a + b.allocated, 0)
const spent = budgetData.reduce((a, b) => a + b.spent, 0)

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Budget Overview</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Financial year 2024-25</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: formatCurrency(total), icon: Wallet, color: 'from-primary-500 to-violet-500', change: null },
          { label: 'Total Spent', value: formatCurrency(spent), icon: TrendingDown, color: 'from-amber-500 to-orange-500', change: `${Math.round(spent/total*100)}%` },
          { label: 'Remaining', value: formatCurrency(total - spent), icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: `${Math.round((total-spent)/total*100)}%` },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                {s.change && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">{s.change}</span>}
              </div>
              <div className="text-xl font-extrabold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader><CardTitle>Department-wise Budget (₹ Lakhs)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetData.map(d => ({ ...d, allocated: Math.round(d.allocated/100000), spent: Math.round(d.spent/100000) }))} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="allocated" fill="#e0e7ff" radius={[0, 4, 4, 0]} name="Allocated" />
                <Bar dataKey="spent" fill="#6366f1" radius={[0, 4, 4, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle>Budget Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RPie>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [formatCurrency(v), '']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }} />
              </RPie>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-[var(--text-secondary)] truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>Department Budget Details</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  {['Department', 'Allocated', 'Spent', 'Remaining', 'Utilization'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {budgetData.map((d, i) => {
                  const utilization = Math.round(d.spent / d.allocated * 100)
                  return (
                    <tr key={i} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                      <td className="px-5 py-3 font-medium text-[var(--text-primary)]">{d.dept}</td>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">{formatCurrency(d.allocated)}</td>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">{formatCurrency(d.spent)}</td>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">{formatCurrency(d.allocated - d.spent)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5 w-20">
                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${utilization}%` }} />
                          </div>
                          <span className="text-xs text-[var(--text-secondary)]">{utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
