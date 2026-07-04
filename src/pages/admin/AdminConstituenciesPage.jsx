import { motion } from 'framer-motion'
import { MapPin, Users, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'

const mockConstituencies = [
  { id: 1, name: 'North Delhi', state: 'Delhi', villages: 45, wards: 12, population: 580000, mp: 'Rajesh Kumar' },
  { id: 2, name: 'Mumbai North', state: 'Maharashtra', villages: 32, wards: 24, population: 1200000, mp: 'Priya Mehta' },
  { id: 3, name: 'Bengaluru Central', state: 'Karnataka', villages: 28, wards: 18, population: 950000, mp: 'Arjun Nair' },
  { id: 4, name: 'Chennai North', state: 'Tamil Nadu', villages: 36, wards: 15, population: 780000, mp: 'Kavitha Rajagopal' },
  { id: 5, name: 'Hyderabad', state: 'Telangana', villages: 50, wards: 20, population: 1100000, mp: 'Mohammed Ali' },
  { id: 6, name: 'Kolkata South', state: 'West Bengal', villages: 38, wards: 16, population: 870000, mp: 'Sunita Banerjee' },
]

export default function AdminConstituenciesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Constituencies</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{mockConstituencies.length} constituencies</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Constituency</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockConstituencies.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{c.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{c.state}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-2.5">
                  <div className="font-semibold text-[var(--text-primary)]">{c.villages}</div>
                  <div className="text-[var(--text-muted)]">Villages</div>
                </div>
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-2.5">
                  <div className="font-semibold text-[var(--text-primary)]">{c.wards}</div>
                  <div className="text-[var(--text-muted)]">Wards</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <Users className="w-3.5 h-3.5" />
                {(c.population / 100000).toFixed(1)}L population · MP: {c.mp}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
