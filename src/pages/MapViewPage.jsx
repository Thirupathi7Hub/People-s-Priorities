import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { MapPin, AlertCircle, RefreshCw } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'
import { PageSkeleton } from '../components/ui/Skeleton'
import { complaintService } from '../services/api'
import { formatRelativeTime } from '../utils'
import { useLocation } from 'react-router-dom'

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const statusColors = {
  pending:     '#f59e0b',
  open:        '#3b82f6',
  in_progress: '#6366f1',
  resolved:    '#22c55e',
  closed:      '#6b7280',
}

const createPinIcon = (color) => L.divIcon({
  html: `<div style="
    width: 28px; height: 28px;
    border-radius: 50% 50% 50% 0;
    background: ${color};
    border: 3px solid white;
    box-shadow: 0 3px 10px rgba(0,0,0,0.35);
    transform: rotate(-45deg);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
  className: '',
})

const STATUS_LABELS = {
  pending: 'Pending', open: 'Open', in_progress: 'In Progress',
  resolved: 'Resolved', closed: 'Closed',
}

export default function MapViewPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const routeLocation = useLocation()

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    complaintService.getAll({ limit: 200 })
      .then(res => {
        if (!active) return
        setComplaints(res.data || [])
      })
      .catch(err => {
        console.error(err)
        if (active) setError('Failed to load complaints from database.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  // Complaints WITH GPS coordinates → shown on map
  const withCoords = complaints.filter(
    c => c.location_lat != null && c.location_lng != null &&
         !isNaN(Number(c.location_lat)) && !isNaN(Number(c.location_lng))
  )

  // Complaints WITHOUT coordinates → listed below
  const withoutCoords = complaints.filter(
    c => !c.location_lat || !c.location_lng ||
         isNaN(Number(c.location_lat)) || isNaN(Number(c.location_lng))
  )

  const filtered = statusFilter
    ? withCoords.filter(c => c.status === statusFilter)
    : withCoords

  const filteredNoCoords = statusFilter
    ? withoutCoords.filter(c => c.status === statusFilter)
    : withoutCoords

  // Stat counts from all complaints
  const statusCounts = Object.keys(statusColors).reduce((acc, s) => {
    acc[s] = complaints.filter(c => c.status === s).length
    return acc
  }, {})

  // Map center: average of all pinned complaints, or India default
  const mapCenter = filtered.length > 0
    ? [
        filtered.reduce((s, c) => s + Number(c.location_lat), 0) / filtered.length,
        filtered.reduce((s, c) => s + Number(c.location_lng), 0) / filtered.length,
      ]
    : [20.5937, 78.9629]

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Map View</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Real-time complaint locations from the database
            {complaints.length > 0 && (
              <span className="ml-2 text-xs font-semibold text-primary-500">
                ({complaints.length} total · {withCoords.length} on map)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true)
            complaintService.getAll({ limit: 200 })
              .then(res => setComplaints(res.data || []))
              .catch(console.error)
              .finally(() => setLoading(false))
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <select
          className="input-base w-40 text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        {/* Legend */}
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
          {Object.entries(statusColors).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="capitalize">{s.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div
        className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-lg"
        style={{ height: '500px' }}
      >
        {complaints.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center bg-[var(--bg-card)] text-[var(--text-secondary)] gap-3">
            <MapPin className="w-12 h-12 opacity-30" />
            <p className="font-semibold">No complaints submitted yet</p>
            <p className="text-sm">When citizens submit complaints with GPS location, they appear here.</p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={filtered.length > 0 ? 6 : 5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filtered.map(c => (
              <Marker
                key={c.id}
                position={[Number(c.location_lat), Number(c.location_lng)]}
                icon={createPinIcon(statusColors[c.status] || '#6366f1')}
              >
                <Popup>
                  <div className="p-1 min-w-[200px] max-w-[260px]">
                    <p className="font-bold text-sm leading-snug mb-1">{c.title}</p>
                    {c.location_text && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin style={{ width: '12px', height: '12px' }} />
                        {c.location_text}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${statusColors[c.status] || '#6366f1'}22`,
                          color: statusColors[c.status] || '#6366f1',
                        }}
                      >
                        {STATUS_LABELS[c.status] || c.status}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {c.categories?.name || c.category || 'Other'}
                      </span>
                    </div>
                    {c.citizen_name && (
                      <p className="text-xs text-gray-400 mt-1.5">By: {c.citizen_name}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(c.created_at)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusColors).map(([status, color]) => (
          <motion.div key={status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => setStatusFilter(prev => prev === status ? '' : status)}
              className={`w-full card p-4 flex items-center gap-3 transition-all hover:shadow-md ${
                statusFilter === status ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
              <div className="text-left">
                <div className="text-lg font-bold text-[var(--text-primary)]">{statusCounts[status] || 0}</div>
                <div className="text-xs text-[var(--text-muted)] capitalize">{status.replace('_', ' ')}</div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Complaints without GPS coordinates */}
      {filteredNoCoords.length > 0 && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            {filteredNoCoords.length} complaint{filteredNoCoords.length > 1 ? 's' : ''} without GPS location
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {filteredNoCoords.slice(0, 8).map(c => (
              <div key={c.id} className="py-2.5 flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: statusColors[c.status] || '#6366f1' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                    <span>{c.location_text || 'No location provided'}</span>
                    <span>·</span>
                    <span>{STATUS_LABELS[c.status] || c.status}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(c.created_at)}</span>
                  </p>
                </div>
              </div>
            ))}
            {filteredNoCoords.length > 8 && (
              <p className="pt-2 text-xs text-[var(--text-muted)]">
                +{filteredNoCoords.length - 8} more complaints without GPS
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty state for filtered results */}
      {filtered.length === 0 && withCoords.length > 0 && statusFilter && (
        <div className="card p-8 text-center text-[var(--text-secondary)]">
          <p className="font-semibold">No {statusFilter.replace('_', ' ')} complaints with GPS location</p>
          <p className="text-sm mt-1">Try a different status filter.</p>
        </div>
      )}
    </div>
  )
}
