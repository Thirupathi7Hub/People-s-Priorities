import { useState, useEffect, Suspense, lazy } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, MapPin, ThumbsUp, MessageSquare, Eye } from 'lucide-react'
import { complaintService } from '../../services/api'
import { Card, CardContent } from '../../components/ui/Card'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/ErrorBoundary'
import { formatRelativeTime } from '../../utils'
import { CATEGORIES, COMPLAINT_STATUS } from '../../constants'
import Avatar from '../../components/ui/Avatar'

const mockComplaints = []

export default function ComplaintsListPage({ role = 'citizen' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [viewMode, setViewMode] = useState('list')

  useEffect(() => {
    let active = true
    setLoading(true)
    
    const params = {}
    if (statusFilter) params.status = statusFilter
    
    complaintService.getAll(params)
      .then(res => {
        if (!active) return
        const dbList = (res.data || []).map(c => ({
          id: c.id,
          title: c.title,
          status: c.status,
          priority: c.priority,
          category: c.categories?.name || 'Other',
          votes: c.upvotes || 0,
          comments: c.comments_count || 0,
          created_at: c.created_at,
          citizen: {
            full_name: c.citizen_name || 'Citizen User',
            avatar_url: c.citizen_avatar || null
          },
          location: c.location_text || 'Constituency Area'
        }))
        
        setComplaints(dbList)
      })
      .catch(err => {
        console.error('Failed to load live complaints:', err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [statusFilter, categoryFilter])

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || c.status === statusFilter
    const matchCategory = !categoryFilter || c.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  const dashPath = `/dashboard/${role}`

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Complaints</h1>
          <p className="text-sm text-[var(--text-secondary)]">{filtered.length} complaints found</p>
        </div>
        {role === 'citizen' && (
          <Link to="/dashboard/citizen/complaints/new">
            <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">New Complaint</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search complaints..."
            className="input-base pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-base w-full sm:w-40"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {Object.values(COMPLAINT_STATUS).map(s => (
            <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
        <select
          className="input-base w-full sm:w-44"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? <TableSkeleton rows={5} /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Filter}
              title="No complaints found"
              description="Try adjusting your search or filters"
            />
          ) : (
            filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={`${dashPath}/complaints/${c.id}`}>
                  <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <Avatar src={c.citizen.avatar_url} name={c.citizen.full_name} size="sm" className="mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex-1">{c.title}</h3>
                          <div className="flex items-center gap-2 shrink-0">
                            <PriorityBadge priority={c.priority} />
                            <StatusBadge status={c.status} />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                          <span className="font-medium text-[var(--text-secondary)]">{c.category}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                          <span>{c.citizen.full_name}</span>
                          <span>{formatRelativeTime(c.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-primary-600 transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" /> {c.votes}
                          </button>
                          <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-primary-600 transition-colors">
                            <MessageSquare className="w-3.5 h-3.5" /> {c.comments}
                          </button>
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
