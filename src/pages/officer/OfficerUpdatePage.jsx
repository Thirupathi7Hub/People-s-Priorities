import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Clock, AlertCircle, RefreshCw, ChevronDown,
  StickyNote, Send, Search, Filter
} from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { complaintService } from '../../services/api'
import { formatRelativeTime } from '../../utils'

const STATUS_OPTIONS = [
  { value: 'open',        label: 'Open',        color: 'bg-blue-500',    icon: AlertCircle },
  { value: 'pending',     label: 'Pending',     color: 'bg-amber-500',   icon: Clock },
  { value: 'in_progress', label: 'In Progress', color: 'bg-primary-500', icon: RefreshCw },
  { value: 'resolved',    label: 'Resolved',    color: 'bg-green-500',   icon: CheckCircle2 },
]

function StatusSelector({ currentStatus, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const current = STATUS_OPTIONS.find(s => s.value === currentStatus) || STATUS_OPTIONS[0]

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen(p => !p)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-primary-500 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`w-2 h-2 rounded-full ${current.color}`} />
        {current.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1.5 left-0 z-50 min-w-[160px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden"
          >
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-left hover:bg-[var(--bg-tertiary)] transition-colors ${opt.value === currentStatus ? 'text-primary-600 bg-primary-50/40 dark:bg-primary-950/20' : 'text-[var(--text-primary)]'}`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                {opt.label}
                {opt.value === currentStatus && <CheckCircle2 className="w-3 h-3 ml-auto text-primary-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function OfficerUpdatePage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('active') // 'all' | 'active' | 'resolved'

  // Per-complaint local state: { [id]: { status, note, saving, saved, error } }
  const [states, setStates] = useState({})

  useEffect(() => {
    let active = true
    setLoading(true)
    complaintService.getAll()
      .then(res => {
        if (!active) return
        const data = res.data || []
        setComplaints(data)
        // Initialize local states
        const init = {}
        data.forEach(c => {
          init[c.id] = { status: c.status, note: '', saving: false, saved: false, error: null }
        })
        setStates(init)
      })
      .catch(err => console.error(err))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const setField = (id, field, value) => {
    setStates(prev => ({ ...prev, [id]: { ...prev[id], [field]: value, saved: false } }))
  }

  const handleSave = async (complaint) => {
    const s = states[complaint.id]
    if (!s) return
    setField(complaint.id, 'saving', true)
    setField(complaint.id, 'error', null)
    try {
      await complaintService.update(complaint.id, {
        status: s.status,
        ...(s.note.trim() ? { resolution_note: s.note.trim() } : {})
      })
      setStates(prev => ({
        ...prev,
        [complaint.id]: { ...prev[complaint.id], saving: false, saved: true, note: '' }
      }))
      // Update local list too
      setComplaints(prev => prev.map(c =>
        c.id === complaint.id ? { ...c, status: s.status } : c
      ))
    } catch (err) {
      setStates(prev => ({
        ...prev,
        [complaint.id]: { ...prev[complaint.id], saving: false, error: err.message || 'Failed to update' }
      }))
    }
  }

  if (loading) return <PageSkeleton />

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'active' ? (c.status !== 'resolved' && c.status !== 'closed') :
      (c.status === 'resolved' || c.status === 'closed')
    return matchSearch && matchFilter
  })

  const activeCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length
  const resolvedCount = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Update Status</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Mark complaints as resolved, add notes, and track progress
          </p>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
            {activeCount} active
          </span>
          <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400">
            {resolvedCount} resolved
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            placeholder="Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-xl">
          {[
            { key: 'active', label: 'Active' },
            { key: 'resolved', label: 'Resolved' },
            { key: 'all', label: 'All' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-[var(--text-secondary)]">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-500 opacity-50" />
            <p className="font-semibold">No complaints found</p>
            <p className="text-sm mt-1">Try changing the filter or search term.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((complaint, i) => {
            const s = states[complaint.id] || { status: complaint.status, note: '', saving: false, saved: false, error: null }
            const isChanged = s.status !== complaint.status || s.note.trim()
            const isResolved = s.status === 'resolved' || s.status === 'closed'

            return (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`card border transition-all ${isResolved ? 'border-green-200 dark:border-green-900/40 bg-green-50/10 dark:bg-green-950/5' : 'border-[var(--border-color)]'}`}
              >
                <div className="p-4 space-y-3">
                  {/* Top row: title + badges + status selector */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] leading-snug">{complaint.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <PriorityBadge priority={complaint.priority} />
                        <span className="text-xs text-[var(--text-muted)]">
                          {complaint.categories?.name || complaint.category || 'Other'}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">·</span>
                        <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(complaint.created_at)}</span>
                      </div>
                    </div>

                    {/* Status selector */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[var(--text-muted)] hidden sm:inline">Set status:</span>
                      <StatusSelector
                        currentStatus={s.status}
                        onChange={val => {
                          setComplaints(prev => prev.map(c =>
                            c.id === complaint.id ? { ...c, _pendingStatus: val } : c
                          ))
                          setField(complaint.id, 'status', val)
                          setField(complaint.id, 'saved', false)
                        }}
                        disabled={s.saving}
                      />
                    </div>
                  </div>

                  {/* Resolution note input */}
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 relative">
                      <StickyNote className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <input
                        value={s.note}
                        onChange={e => setField(complaint.id, 'note', e.target.value)}
                        placeholder={isResolved ? 'Add resolution note (optional)...' : 'Add a progress note (optional)...'}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                    </div>

                    {/* Save button */}
                    <button
                      onClick={() => handleSave(complaint)}
                      disabled={s.saving || (!isChanged && !s.note.trim())}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        s.saved
                          ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800'
                          : isChanged || s.note.trim()
                          ? 'bg-gradient-to-r from-primary-500 to-violet-500 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)] cursor-not-allowed'
                      }`}
                    >
                      {s.saving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : s.saved ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</>
                      ) : (
                        <><Send className="w-3.5 h-3.5" /> Update</>
                      )}
                    </button>
                  </div>

                  {/* Error */}
                  {s.error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {s.error}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
