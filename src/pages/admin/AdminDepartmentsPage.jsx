import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'

const mockDepts = [
  { id: 1, name: 'Public Works Department', code: 'PWD', head: 'R. Mehta', staff: 45, complaints: 234 },
  { id: 2, name: 'Water & Sanitation Authority', code: 'WSA', head: 'A. Patel', staff: 32, complaints: 178 },
  { id: 3, name: 'Electricity Distribution', code: 'ELEC', head: 'S. Kumar', staff: 28, complaints: 145 },
  { id: 4, name: 'Health Department', code: 'HEALTH', head: 'D. Singh', staff: 56, complaints: 89 },
  { id: 5, name: 'Education Department', code: 'EDU', head: 'P. Nair', staff: 38, complaints: 67 },
]

export default function AdminDepartmentsPage() {
  const [depts, setDepts] = useState(mockDepts)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', head: '' })

  const handleCreate = () => {
    if (!form.name) return
    setDepts(p => [...p, { id: Date.now(), ...form, staff: 0, complaints: 0 }])
    setForm({ name: '', code: '', head: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Departments</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{depts.length} departments</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {depts.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shrink-0 text-white text-xs font-bold">
                  {d.code}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{d.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Head: {d.head}</p>
                </div>
                <div className="flex gap-1">
                  <button className="btn-ghost p-1.5 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                <span>{d.staff} Staff</span>
                <span>{d.complaints} Complaints</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Department">
        <div className="p-5 space-y-4">
          <Input label="Department Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Public Works" required />
          <Input label="Code" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g. PWD" />
          <Input label="Department Head" value={form.head} onChange={e => setForm(p => ({ ...p, head: e.target.value }))} placeholder="Officer name" />
          <Button onClick={handleCreate} className="w-full">Create Department</Button>
        </div>
      </Modal>
    </div>
  )
}
