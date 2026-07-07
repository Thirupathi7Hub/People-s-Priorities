import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Search, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { complaintService, userService } from '../../services/api'
import { formatRelativeTime } from '../../utils'

export default function MPAssignPage() {
  const [complaints, setComplaints] = useState([])
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [assigning, setAssigning] = useState(null)
  const [assignments, setAssignments] = useState({}) // complaintId -> officerId
  const [successMap, setSuccessMap] = useState({})

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([
      complaintService.getAll(),
      userService.getAll({ role: 'officer' }).catch(() => ({ data: [] }))
    ])
      .then(([compRes, officerRes]) => {
        if (!active) return
        setComplaints(compRes.data || [])
        setOfficers(officerRes.data || [])
      })
      .catch(err => console.error(err))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleAssign = async (complaintId) => {
    const officerId = assignments[complaintId]
    if (!officerId) return
    setAssigning(complaintId)
    try {
      await complaintService.update(complaintId, {
        assigned_officer_id: officerId,
        status: 'in_progress'
      })
      setSuccessMap(prev => ({ ...prev, [complaintId]: true }))
      setComplaints(prev => prev.map(c =>
        c.id === complaintId ? { ...c, assigned_officer_id: officerId, status: 'in_progress' } : c
      ))
    } catch (err) {
      console.error('Assignment failed:', err)
    } finally {
      setAssigning(null)
    }
  }

  if (loading) return <PageSkeleton />

  const filtered = complaints.filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase())
  )

  const unassigned = filtered.filter(c => !c.assigned_officer_id)
  const assigned = filtered.filter(c => c.assigned_officer_id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Assign Issues</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Assign complaints to Solver Officers for resolution
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-semibold">
            {unassigned.length} unassigned
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-semibold">
            {assigned.length} assigned
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          placeholder="Search complaints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Officer availability note */}
      {officers.length === 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>No officers found in the system. Ask your admin to register officer accounts so you can assign complaints to them.</p>
        </div>
      )}

      {/* Unassigned complaints */}
      {unassigned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Complaints</CardTitle>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
              Needs Assignment
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border-color)]">
              {unassigned.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap">
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                      <span>{formatRelativeTime(c.created_at)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {officers.length > 0 ? (
                      <>
                        <select
                          value={assignments[c.id] || ''}
                          onChange={e => setAssignments(prev => ({ ...prev, [c.id]: e.target.value }))}
                          className="text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        >
                          <option value="">Select Officer</option>
                          {officers.map(o => (
                            <option key={o.id} value={o.id}>{o.full_name || o.email}</option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          disabled={!assignments[c.id] || assigning === c.id}
                          loading={assigning === c.id}
                          onClick={() => handleAssign(c.id)}
                        >
                          {successMap[c.id] ? <CheckCircle2 className="w-4 h-4" /> : 'Assign'}
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)] italic">No officers available</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already assigned */}
      {assigned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Already Assigned</CardTitle>
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
              In Progress
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border-color)]">
              {assigned.map((c, i) => {
                const officer = officers.find(o => o.id === c.assigned_officer_id)
                return (
                  <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Assigned to: <span className="font-medium text-[var(--text-primary)]">
                          {officer ? (officer.full_name || officer.email) : 'Unknown Officer'}
                        </span> · <StatusBadge status={c.status} />
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-[var(--text-secondary)]">
            <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No complaints found</p>
            <p className="text-sm mt-1">Try adjusting your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
