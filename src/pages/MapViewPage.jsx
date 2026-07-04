import { useState, useEffect, lazy, Suspense } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { MapPin, Filter, Layers, ZoomIn } from 'lucide-react'
import { StatusBadge } from '../components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { CATEGORIES } from '../constants'

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const createCustomIcon = (color) => L.divIcon({
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:rotate(-45deg)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  className: '',
})

const statusColors = {
  pending: '#f59e0b',
  open: '#3b82f6',
  in_progress: '#6366f1',
  resolved: '#22c55e',
  closed: '#6b7280',
}

// Mock markers across India
const mockMarkers = [
  { id: 1, lat: 28.6139, lng: 77.2090, title: 'Road damage near India Gate', status: 'open', category: 'Roads', location: 'New Delhi' },
  { id: 2, lat: 19.0760, lng: 72.8777, title: 'Water supply issue in Bandra', status: 'in_progress', category: 'Water Supply', location: 'Mumbai' },
  { id: 3, lat: 12.9716, lng: 77.5946, title: 'Power outage MG Road', status: 'resolved', category: 'Electricity', location: 'Bengaluru' },
  { id: 4, lat: 22.5726, lng: 88.3639, title: 'Garbage not collected', status: 'pending', category: 'Sanitation', location: 'Kolkata' },
  { id: 5, lat: 13.0827, lng: 80.2707, title: 'Pothole on Anna Salai', status: 'open', category: 'Roads', location: 'Chennai' },
  { id: 6, lat: 17.3850, lng: 78.4867, title: 'Street light broken', status: 'pending', category: 'Electricity', location: 'Hyderabad' },
  { id: 7, lat: 23.0225, lng: 72.5714, title: 'Open drainage issue', status: 'in_progress', category: 'Sanitation', location: 'Ahmedabad' },
  { id: 8, lat: 18.5204, lng: 73.8567, title: 'Park not maintained', status: 'resolved', category: 'Environment', location: 'Pune' },
]

const mockProjects = [
  { id: 1, lat: 28.7041, lng: 77.1025, title: 'Highway Widening Project', status: 'ongoing', budget: '₹12 Cr' },
  { id: 2, lat: 19.2183, lng: 72.9781, title: 'Solar Street Lights', status: 'approved', budget: '₹3.2 Cr' },
]

export default function MapViewPage() {
  const [activeLayer, setActiveLayer] = useState('complaints')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedMarker, setSelectedMarker] = useState(null)

  const filtered = statusFilter
    ? mockMarkers.filter(m => m.status === statusFilter)
    : mockMarkers

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Map View</h1>
          <p className="text-sm text-[var(--text-secondary)]">Geographic distribution of complaints & projects</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
          {['complaints', 'projects'].map(l => (
            <button
              key={l}
              onClick={() => setActiveLayer(l)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeLayer === l
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        {activeLayer === 'complaints' && (
          <select
            className="input-base w-36 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs text-[var(--text-muted)]">
          {Object.entries(statusColors).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="capitalize">{s.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-lg" style={{ height: '500px' }}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {activeLayer === 'complaints' && filtered.map(m => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createCustomIcon(statusColors[m.status] || '#6366f1')}
            >
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <p className="font-semibold text-sm">{m.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{m.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                      background: `${statusColors[m.status]}20`,
                      color: statusColors[m.status],
                    }}>
                      {m.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{m.category}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {activeLayer === 'projects' && mockProjects.map(p => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={createCustomIcon('#8b5cf6')}
            >
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <p className="font-semibold text-sm">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {p.status}</p>
                  <p className="text-xs text-gray-500">Budget: {p.budget}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Stats below map */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, color]) => {
          const count = mockMarkers.filter(m => m.status === status).length
          return (
            <motion.div key={status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card p-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                <div>
                  <div className="text-lg font-bold text-[var(--text-primary)]">{count}</div>
                  <div className="text-xs text-[var(--text-muted)] capitalize">{status.replace('_', ' ')}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
