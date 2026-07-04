import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageSquare, MapPin, Clock, Share2, Flag } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { formatDate, formatRelativeTime } from '../../utils'
import { useAuth } from '../../contexts/AuthContext'

import { complaintService } from '../../services/api'

const mockComplaints = [
  { id: 1, title: 'Deep pothole on MG Road near Chandni Chowk', status: 'in_progress', priority: 'high', category: 'Roads & Infrastructure', votes: 45, comments: 12, created_at: '2024-01-15T10:00:00Z', citizen: { full_name: 'Priya Sharma', avatar_url: null }, location: 'Chandni Chowk, Delhi' },
  { id: 2, title: 'Water supply disruption in Sector 4 for 3 days', status: 'open', priority: 'critical', category: 'Water Supply', votes: 89, comments: 23, created_at: '2024-01-14T14:00:00Z', citizen: { full_name: 'Rohit Mehta', avatar_url: null }, location: 'Sector 4, Noida' },
  { id: 3, title: 'Street light malfunction on Park Avenue', status: 'pending', priority: 'medium', category: 'Electricity', votes: 12, comments: 3, created_at: '2024-01-13T09:00:00Z', citizen: { full_name: 'Anita Singh', avatar_url: null }, location: 'Park Avenue, Mumbai' },
  { id: 4, title: 'Garbage collection missed for 5 consecutive days', status: 'resolved', priority: 'high', category: 'Sanitation', votes: 67, comments: 18, created_at: '2024-01-10T11:00:00Z', citizen: { full_name: 'Arjun Patel', avatar_url: null }, location: 'Bandra West, Mumbai' },
  { id: 5, title: 'Damaged footpath near government school', status: 'open', priority: 'low', category: 'Roads & Infrastructure', votes: 28, comments: 7, created_at: '2024-01-09T08:00:00Z', citizen: { full_name: 'Meera Iyer', avatar_url: null }, location: 'T Nagar, Chennai' },
  { id: 6, title: 'Sewage overflow on Main Street', status: 'pending', priority: 'critical', category: 'Sanitation', votes: 134, comments: 45, created_at: '2024-01-08T16:00:00Z', citizen: { full_name: 'Rahul Gupta', avatar_url: null }, location: 'Connaught Place, Delhi' },
]

const mockComplaint = {
  id: 1,
  title: 'Deep pothole on MG Road causing accidents',
  description: 'There is a very deep pothole near the bus stop on MG Road which has been causing accidents and damaging vehicles. Multiple bikes and autos have been affected. Despite multiple complaints to the local municipal office, no action has been taken in the last 3 weeks. The pothole is approximately 1 foot deep and 2 feet wide. It becomes extremely dangerous during night hours and rainy season.',
  status: 'in_progress',
  priority: 'high',
  category: 'Roads & Infrastructure',
  location: 'MG Road, near Bus Stop 14, New Delhi - 110001',
  location_lat: 28.6304,
  location_lng: 77.2177,
  created_at: '2024-01-10T10:00:00Z',
  updated_at: '2024-01-15T14:00:00Z',
  citizen: { full_name: 'Priya Sharma', avatar_url: null },
  votes: { up: 89, down: 3 },
  comments: [
    { id: 1, content: 'This has been a problem for months. The NDMC is completely unresponsive.', user: { full_name: 'Rohit Kumar', avatar_url: null }, created_at: '2024-01-11T09:00:00Z' },
    { id: 2, content: 'I agree, my vehicle was also damaged. We need urgent action.', user: { full_name: 'Anita Singh', avatar_url: null }, created_at: '2024-01-12T11:00:00Z' },
    { id: 3, content: 'Filed complaint on NDMC portal also but no response so far.', user: { full_name: 'Vivek Gupta', avatar_url: null }, created_at: '2024-01-13T14:00:00Z' },
  ],
  activity: [
    { action: 'Complaint submitted', date: '2024-01-10T10:00:00Z', by: 'Priya Sharma', color: 'bg-blue-500' },
    { action: 'Assigned to PWD Officer Mehta', date: '2024-01-11T09:00:00Z', by: 'System', color: 'bg-amber-500' },
    { action: 'Status updated to In Progress', date: '2024-01-15T14:00:00Z', by: 'Officer Mehta', color: 'bg-primary-500' },
  ],
}

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [votes, setVotes] = useState({ up: 0, down: 0 })
  const [submitting, setSubmitting] = useState(false)
  const [activity, setActivity] = useState([])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    
    const isMockId = !isNaN(Number(id)) && Number(id) >= 1 && Number(id) <= 6
    
    if (isMockId) {
      const matchedMock = mockComplaints.find(mc => mc.id === Number(id)) || mockComplaint
      const fullMock = {
        ...mockComplaint,
        ...matchedMock,
        id: matchedMock.id,
      }
      setComplaint(fullMock)
      setComments(fullMock.comments || [])
      setVotes(fullMock.votes || { up: matchedMock.votes || 0, down: 0 })
      setActivity(fullMock.activity || [])
      setLoading(false)
      return
    }

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
