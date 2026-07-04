import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import { CATEGORIES } from '../../constants'

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(CATEGORIES)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Complaint Categories</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{cats.length} categories</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
            <div className="card p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{c.icon}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="btn-ghost p-1 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button className="btn-ghost p-1 rounded-lg text-red-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{c.name}</p>
              <div className="w-full h-1 rounded-full mt-3" style={{ background: `${c.color}30` }}>
                <div className="h-1 rounded-full" style={{ background: c.color, width: '60%' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
