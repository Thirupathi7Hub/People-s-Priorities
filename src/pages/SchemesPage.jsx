import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Calendar, Users } from 'lucide-react'

const schemes = [
  { id: 1, title: 'PM Awas Yojana (Gramin)', ministry: 'Ministry of Rural Development', deadline: '2025-03-31', beneficiaries: '2.95 crore', emoji: '🏠', category: 'Housing' },
  { id: 2, title: 'Pradhan Mantri Kisan Samman Nidhi', ministry: 'Ministry of Agriculture', deadline: 'Ongoing', beneficiaries: '11.5 crore', emoji: '🌾', category: 'Agriculture' },
  { id: 3, title: 'Ayushman Bharat PM-JAY', ministry: 'Ministry of Health', deadline: 'Ongoing', beneficiaries: '50 crore+', emoji: '🏥', category: 'Healthcare' },
  { id: 4, title: 'PM Ujjwala Yojana 2.0', ministry: 'Ministry of Petroleum', deadline: '2024-12-31', beneficiaries: '9 crore', emoji: '🔥', category: 'Energy' },
  { id: 5, title: 'Skill India Mission', ministry: 'Ministry of Skill Development', deadline: 'Ongoing', beneficiaries: '40 crore', emoji: '💼', category: 'Employment' },
  { id: 6, title: 'Beti Bachao Beti Padhao', ministry: 'Ministry of Women & Child Development', deadline: 'Ongoing', beneficiaries: 'All girls', emoji: '👧', category: 'Education' },
]

export default function SchemesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Government Schemes</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Active welfare schemes available for your constituency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schemes.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mb-3">{s.ministry}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {s.deadline}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.beneficiaries}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 font-medium">{s.category}</span>
                <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Learn more <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
