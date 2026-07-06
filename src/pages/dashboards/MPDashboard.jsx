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

import { Sparkles, Download, MapPin, UserCheck, AlertCircle } from 'lucide-react'
import { userService } from '../../services/api'

function StatCard({ icon: Icon, label, value, color, to }) {
  const Wrapper = to ? Link : 'div'
  return (
    <Wrapper to={to}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 hover:shadow-md transition-all cursor-pointer bg-[var(--bg-card)] border border-[var(--border-color)]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-[var(--text-primary)]">{value}</div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
      </motion.div>
    </Wrapper>
  )
}

export default function MPDashboard() {
  const { profile, user } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] || 'Leader'
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [officers, setOfficers] = useState([])

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      complaintService.getAll(),
      userService.getAllUsers({ role: 'officer' })
    ])
      .then(([complaintsRes, officersRes]) => {
        if (!active) return
        setComplaints(complaintsRes.data || [])
        setOfficers(officersRes.data || [])
      })
      .catch(err => console.error('Failed to load MP dashboard data:', err))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const totalCount = complaints.length
  const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  const pendingCount = complaints.filter(c => c.status === 'pending').length
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length

  // Build category stats dynamically
  const categoryCounts = {
    Roads: { pending: 0, in_progress: 0, resolved: 0 },
    Water: { pending: 0, in_progress: 0, resolved: 0 },
    Power: { pending: 0, in_progress: 0, resolved: 0 },
    Sanitation: { pending: 0, in_progress: 0, resolved: 0 },
    Other: { pending: 0, in_progress: 0, resolved: 0 },
  }

  complaints.forEach(c => {
    const cat = c.categories?.name || c.category || 'Other'
    let group = 'Other'
    if (cat.toLowerCase().includes('road') || cat.toLowerCase().includes('infra')) group = 'Roads'
    else if (cat.toLowerCase().includes('water')) group = 'Water'
    else if (cat.toLowerCase().includes('power') || cat.toLowerCase().includes('electr')) group = 'Power'
    else if (cat.toLowerCase().includes('sanit') || cat.toLowerCase().includes('garb')) group = 'Sanitation'

    let statusGroup = 'pending'
    if (c.status === 'resolved' || c.status === 'closed') statusGroup = 'resolved'
    else if (c.status === 'in_progress') statusGroup = 'in_progress'

    categoryCounts[group][statusGroup] += 1
  })

  const categoryStats = Object.keys(categoryCounts).map(name => ({
    name,
    pending: categoryCounts[name].pending,
    in_progress: categoryCounts[name].in_progress,
    resolved: categoryCounts[name].resolved,
  }))

  const radarData = Object.keys(categoryCounts).map(name => ({
    category: name,
    A: categoryCounts[name].pending + categoryCounts[name].in_progress + categoryCounts[name].resolved
  }))

  // Issue hotspots: group complaints by location
  const locationCounts = {}
  complaints.forEach(c => {
    const loc = c.location || c.location_text || 'Other'
    const shortLoc = loc.split(',')[0].trim()
    locationCounts[shortLoc] = (locationCounts[shortLoc] || 0) + 1
  })

  const hotspots = Object.keys(locationCounts)
    .map(name => ({ name, count: locationCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  // AI-generated priorities
  const openComplaints = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed')
  const criticalComplaints = openComplaints.filter(c => c.priority === 'critical' || c.priority === 'high')
  const mostUpvoted = [...openComplaints].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0]

  const aiPriorities = []
  if (criticalComplaints.length > 0) {
    const critCatCounts = {}
    criticalComplaints.forEach(c => {
      const catName = c.categories?.name || c.category || 'Other'
      critCatCounts[catName] = (critCatCounts[catName] || 0) + 1
    })
    const worstCat = Object.keys(critCatCounts).reduce((a, b) => critCatCounts[a] > critCatCounts[b] ? a : b)
    aiPriorities.push({
      icon: '🚨',
      title: 'Critical Infrastructure Focus',
      description: `${worstCat} has the highest concentration of critical complaints (${critCatCounts[worstCat]} unresolved). Allocate funding or deploy officers immediately.`
    })
  } else {
    aiPriorities.push({
      icon: '✅',
      title: 'No Critical Warnings',
      description: 'All highly critical complaints are currently assigned or resolved. Continue monitoring incoming feedback.'
    })
  }

  if (mostUpvoted) {
    aiPriorities.push({
      icon: '🔥',
      title: 'High Citizen Upvote Alarm',
      description: `"${mostUpvoted.title}" in ${mostUpvoted.location || 'Constituency'} has ${mostUpvoted.upvotes || 0} citizen upvotes. Assign a Solver Officer to address public concern.`
    })
  }

  if (totalCount > 0) {
    const rate = Math.round((resolvedCount / totalCount) * 100)
    aiPriorities.push({
      icon: '📈',
      title: 'Constituency Resolution Rate',
      description: `Your resolution rate stands at ${rate}%. Speed up pending status updates to maintain high community trust.`
    })
  }

  const downloadReport = () => {
    const printWindow = window.open('', '_blank')
    const htmlContent = `
      <html>
        <head>
          <title>Constituency Progress Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .metric-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
            .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; }
            .metric-val { font-size: 24px; font-weight: bold; color: #1e3a8a; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #475569; }
            .status { font-weight: 600; text-transform: uppercase; font-size: 11px; }
            .priority { font-weight: 600; text-transform: uppercase; font-size: 11px; }
          </style>
        </head>
        <body>
          <h1>Constituency Complaint & Resolution Report</h1>
          <p>Generated on ${new Date().toLocaleString()} | Active Constituency: India (General)</p>
          <div class="metric-grid">
            <div class="metric-card">Total Complaints<div class="metric-val">${totalCount}</div></div>
            <div class="metric-card">Pending<div class="metric-val">${pendingCount}</div></div>
            <div class="metric-card">In Progress<div class="metric-val">${inProgressCount}</div></div>
            <div class="metric-card">Resolved<div class="metric-val">${resolvedCount}</div></div>
          </div>
          <h2>Hotspot Issue Tracking</h2>
          <table>
            <thead>
              <tr>
                <th>Hotspot Location</th>
                <th>Active Issues</th>
              </tr>
            </thead>
            <tbody>
              ${hotspots.map(h => `<tr><td>${h.name}</td><td>${h.count} complaints</td></tr>`).join('')}
            </tbody>
          </table>
          <h2>Live Complaints Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              ${complaints.map(c => `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.categories?.name || c.category || 'Other'}</td>
                  <td><span class="status">${c.status}</span></td>
                  <td><span class="priority">${c.priority}</span></td>
                  <td>${c.location_text || c.location || 'Constituency Area'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

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
          <Button onClick={downloadReport} variant="secondary" leftIcon={<Download className="w-4 h-4" />} size="sm">
            Download Report (PDF)
          </Button>
          <Link to="/dashboard/mp/map">
            <Button leftIcon={<MapPin className="w-4 h-4" />} size="sm">
              Live Hotspots Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Complaints" value={totalCount} color="from-blue-500 to-cyan-500" to="/dashboard/mp/complaints" />
        <StatCard icon={Clock} label="Pending" value={pendingCount} color="from-amber-500 to-orange-500" to="/dashboard/mp/complaints?status=pending" />
        <StatCard icon={FolderKanban} label="In Progress" value={inProgressCount} color="from-primary-500 to-violet-500" to="/dashboard/mp/complaints?status=in_progress" />
        <StatCard icon={CheckCircle} label="Resolved" value={resolvedCount} color="from-green-500 to-emerald-500" to="/dashboard/mp/complaints?status=resolved" />
      </div>

      {/* AI Priorities section */}
      <Card className="border-l-4 border-indigo-500 shadow-md">
        <CardHeader className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          <CardTitle>AI-Generated Top Priorities</CardTitle>
          <Badge color="primary">Active Advice</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiPriorities.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
            <Badge color="muted">Real Time</Badge>
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

      {/* Heatmap/Hotspots and Assigned Officers list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hotspot Issue Tracking</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border-color)]">
              {hotspots.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                  No issues registered in your constituency.
                </div>
              ) : (
                hotspots.map((h, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{h.name}</span>
                    </div>
                    <Badge color="rose">{h.count} issues</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solver Officers status ({officers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border-color)]">
              {officers.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                  No registered solver officers.
                </div>
              ) : (
                officers.map((off, i) => {
                  const assignedCount = complaints.filter(c => c.assigned_officer_id === off.id).length
                  const resolvedForOff = complaints.filter(c => c.assigned_officer_id === off.id && (c.status === 'resolved' || c.status === 'closed')).length
                  return (
                    <div key={i} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{off.full_name}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Email: {off.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-semibold text-[var(--text-secondary)]">{assignedCount} Assigned</div>
                        <div className="text-[10px] text-green-600 font-semibold">{resolvedForOff} Resolved</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Complaints Row */}
      <Card>
        <CardHeader>
          <CardTitle>All Constituency Complaints</CardTitle>
          <Link to="/dashboard/mp/complaints" className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all complaints <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border-color)]">
            {complaints.slice(0, 5).map((c, i) => {
              const categoryName = c.categories?.name || c.category || 'Other'
              return (
                <Link key={c.id} to={`/dashboard/mp/complaints/${c.id}`}>
                  <div className="px-5 py-4 flex items-start justify-between hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-2">
                        <span>{categoryName}</span>
                        <span>·</span>
                        <span>{c.location_text || c.location || 'Constituency'}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {c.assigned_officer_name ? (
                        <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" />
                          {c.assigned_officer_name.split(' ')[0]}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Unassigned
                        </div>
                      )}
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
