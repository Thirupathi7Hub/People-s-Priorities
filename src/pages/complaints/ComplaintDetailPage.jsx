import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageSquare, MapPin, Clock, Share2, Flag, UserCheck, CheckCircle, FolderKanban, X } from 'lucide-react'
import { StatusBadge, PriorityBadge, Badge } from '../../components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { formatDate, formatRelativeTime } from '../../utils'
import { useAuth } from '../../contexts/AuthContext'

import { complaintService, userService } from '../../services/api'



export default function ComplaintDetailPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [comment, setComment] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [votes, setVotes] = useState({ up: 0, down: 0 })
  const [submitting, setSubmitting] = useState(false)
  const [activity, setActivity] = useState([])

  // MP / Solver Officer assignment and resolution states
  const [officers, setOfficers] = useState([])
  const [selectedOfficerId, setSelectedOfficerId] = useState('')
  const [submittingAssignment, setSubmittingAssignment] = useState(false)

  const [officerStatus, setOfficerStatus] = useState('in_progress')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [submittingResolution, setSubmittingResolution] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    
    complaintService.getById(id)
      .then(res => {
        if (!active) return
        if (res) {
          const c = res
          const formatted = {
            id: c.id,
            title: c.title,
            description: c.description || '',
            status: c.status,
            priority: c.priority,
            category: c.categories?.name || c.category_name || 'Other',
            location: c.location_text || 'Constituency Location',
            location_lat: c.location_lat,
            location_lng: c.location_lng,
            created_at: c.created_at,
            updated_at: c.updated_at,
            assigned_officer_id: c.assigned_officer_id || null,
            assigned_officer_name: c.assigned_officer_name || null,
            resolution_notes: c.resolution_notes || '',
            proof_image_url: c.proof_image_url || null,
            citizen: {
              full_name: c.citizen_name || 'Citizen User',
              avatar_url: c.citizen_avatar || null
            },
            votes: { up: c.upvotes || 0, down: 0 },
            comments: c.comments || [],
            activity: c.activity || [
              { action: 'Complaint submitted', date: c.created_at, by: c.citizen_name || 'Citizen User', color: 'bg-blue-500' }
            ]
          }
          setComplaint(formatted)
          setComments(formatted.comments)
          setVotes(formatted.votes)
          setActivity(formatted.activity)
          
          setOfficerStatus(formatted.status || 'in_progress')
          setResolutionNotes(formatted.resolution_notes || '')
          setProofUrl(formatted.proof_image_url || '')
        } else {
          setError('Complaint not found')
        }
      })
      .catch(err => {
        console.error('Failed to load complaint:', err)
        setError('Failed to load complaint details')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (profile?.role === 'mp' || profile?.role === 'admin') {
      userService.getAllUsers({ role: 'officer' })
        .then(res => {
          setOfficers(res.data || [])
        })
        .catch(err => console.error('Failed to fetch solver officers:', err))
    }
  }, [profile])

  const handleAssignOfficer = async () => {
    if (!selectedOfficerId) return
    setSubmittingAssignment(true)
    try {
      const officer = officers.find(o => o.id === selectedOfficerId)
      if (!officer) return

      const officerName = officer.full_name
      const newActivity = [
        ...activity,
        {
          action: `Assigned to Solver Officer ${officerName}`,
          date: new Date().toISOString(),
          by: profile?.full_name || 'MP / Leader',
          color: 'bg-amber-500'
        }
      ]

      const updates = {
        assigned_officer_id: selectedOfficerId,
        assigned_officer_name: officerName,
        status: 'in_progress',
        activity: newActivity
      }

      await complaintService.update(id, updates)
      
      setComplaint(prev => ({
        ...prev,
        ...updates
      }))
      setActivity(newActivity)
      alert(`Successfully assigned complaint to ${officerName}`)
    } catch (err) {
      console.error('Failed to assign officer:', err)
      alert('Failed to assign officer. Please try again.')
    } finally {
      setSubmittingAssignment(false)
    }
  }

  const handleUpdateResolution = async () => {
    setSubmittingResolution(true)
    try {
      const isResolved = officerStatus === 'resolved'
      const newActivity = [
        ...activity,
        {
          action: isResolved ? 'Marked as Resolved' : 'Status updated to In Progress',
          date: new Date().toISOString(),
          by: profile?.full_name || 'Solver Officer',
          color: isResolved ? 'bg-green-500' : 'bg-primary-500'
        }
      ]

      const updates = {
        status: officerStatus,
        resolution_notes: resolutionNotes,
        proof_image_url: proofUrl || null,
        activity: newActivity
      }

      await complaintService.update(id, updates)

      setComplaint(prev => ({
        ...prev,
        ...updates
      }))
      setActivity(newActivity)
      alert(`Resolution status updated successfully to: ${officerStatus}`)
    } catch (err) {
      console.error('Failed to update resolution:', err)
      alert('Failed to update resolution details. Please try again.')
    } finally {
      setSubmittingResolution(false)
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    setSubmitting(true)
    const newComment = {
      id: Date.now(),
      content: comment,
      user: { full_name: user?.user_metadata?.full_name || 'Anonymous', avatar_url: null },
      created_at: new Date().toISOString(),
    }
    setComments(p => [...p, newComment])
    setComment('')
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-[var(--text-secondary)]">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4" />
        <p className="text-sm font-medium">Loading complaint details...</p>
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto card p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Error Loading Complaint</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{error || 'Complaint not found'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" />{formatRelativeTime(complaint.created_at)}
          </span>
        </div>

        <h1 className="text-lg font-extrabold text-[var(--text-primary)] mb-3">{complaint.title}</h1>

        <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mb-4">
          <span className="font-medium text-[var(--text-secondary)]">{complaint.category}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{complaint.location}</span>
        </div>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{complaint.description}</p>

        {/* Citizen info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]">
          <Avatar src={complaint.citizen.avatar_url} name={complaint.citizen.full_name} size="sm" />
          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">{complaint.citizen.full_name}</p>
            <p className="text-[10px] text-[var(--text-muted)]">Filed on {formatDate(complaint.created_at)}</p>
          </div>
        </div>

        {complaint.proof_image_url && (
          <div className="mt-5 p-4 rounded-xl border border-green-500/20 bg-green-500/5 space-y-3">
            <h3 className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Official Resolution Proof
            </h3>
            {complaint.resolution_notes && (
              <p className="text-sm text-[var(--text-secondary)] italic">
                "{complaint.resolution_notes}"
              </p>
            )}
            <div className="rounded-xl overflow-hidden border border-[var(--border-color)] max-w-md">
              <img src={complaint.proof_image_url} alt="Official Proof" className="w-full h-auto object-cover max-h-72" />
            </div>
          </div>
        )}

        {/* Vote */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => setVotes(v => ({ ...v, up: v.up + 1 }))}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-green-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" /> {votes.up} Upvotes
          </button>
          <button
            onClick={() => setVotes(v => ({ ...v, down: v.down + 1 }))}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-red-500 transition-colors"
          >
            <ThumbsDown className="w-4 h-4" /> {votes.down}
          </button>
          <button className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary-600 ml-auto">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-red-500">
            <Flag className="w-4 h-4" /> Report
          </button>
        </div>
      </div>

      {/* MP Assignment Panel */}
      {(profile?.role === 'mp' || profile?.role === 'admin') && (
        <Card className="border-l-4 border-amber-500 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <CardTitle>Assign Solver Officer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complaint.assigned_officer_name ? (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs flex items-center justify-between">
                <span>Current Assignment: <strong>{complaint.assigned_officer_name}</strong></span>
                <Badge color="primary">Assigned</Badge>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs">
                ⚠️ This complaint is currently unassigned. Please choose an officer below to direct the resolution.
              </div>
            )}
            <div className="flex gap-2">
              <select
                value={selectedOfficerId}
                onChange={e => setSelectedOfficerId(e.target.value)}
                className="input-base text-sm py-2"
              >
                <option value="">Select Solver Officer...</option>
                {officers.map(o => (
                  <option key={o.id} value={o.id}>{o.full_name} ({o.department || 'Officer'})</option>
                ))}
              </select>
              <Button
                onClick={handleAssignOfficer}
                loading={submittingAssignment}
                disabled={!selectedOfficerId}
                size="sm"
              >
                Assign Officer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solver Officer Resolution Panel */}
      {(profile?.role === 'officer' && complaint.assigned_officer_id === (user?.uid || user?.id)) && (
        <Card className="border-l-4 border-green-500 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-green-500" />
            <CardTitle>Update Resolution Status & Proof</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Status</label>
                <select
                  value={officerStatus}
                  onChange={e => setOfficerStatus(e.target.value)}
                  className="input-base text-sm"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Proof Image URL</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={e => setProofUrl(e.target.value)}
                    placeholder="Paste public image link..."
                    className="input-base text-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setProofUrl('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80')}
                    className="shrink-0 text-xs px-2 animate-pulse"
                  >
                    Use Demo Photo
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Resolution Notes</label>
              <textarea
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="Describe action taken, resources used, or comments..."
                rows={3}
                className="input-base text-sm"
              />
            </div>

            {proofUrl && (
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] h-32 w-48">
                <img src={proofUrl} alt="Proof preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setProofUrl('')}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <Button
              onClick={handleUpdateResolution}
              loading={submittingResolution}
              size="sm"
            >
              Submit Resolution Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card>
        <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {activity.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${a.color || 'bg-primary-500'} mt-1.5 shrink-0`} />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{a.action}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {a.by} · {formatRelativeTime(a.date)}
                </p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="flex gap-3">
              <Avatar src={c.user.avatar_url} name={c.user.full_name} size="sm" className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{c.user.full_name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{formatRelativeTime(c.created_at)}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c.content}</p>
              </div>
            </motion.div>
          ))}

          {/* Add comment */}
          <div className="pt-4 border-t border-[var(--border-color)] flex gap-3">
            <Avatar src={user?.user_metadata?.avatar_url} name={user?.user_metadata?.full_name || 'U'} size="sm" className="shrink-0" />
            <div className="flex-1 space-y-2">
              <textarea
                className="input-base resize-none"
                rows={3}
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <Button size="sm" onClick={handleComment} loading={submitting} leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
