import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, MoreVertical, UserPlus, Shield } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { formatDate } from '../../utils'

const mockUsers = [
  { id: 1, full_name: 'Priya Sharma', email: 'priya@example.com', role: 'citizen', created_at: '2024-01-01', is_verified: true, complaints: 5 },
  { id: 2, full_name: 'Rajesh Kumar', email: 'rajesh.mp@example.com', role: 'mp', created_at: '2023-12-15', is_verified: true, complaints: 0 },
  { id: 3, full_name: 'Anita Singh', email: 'anita.officer@example.com', role: 'officer', created_at: '2023-11-20', is_verified: true, complaints: 0 },
  { id: 4, full_name: 'Vivek Gupta', email: 'vivek@example.com', role: 'citizen', created_at: '2024-01-10', is_verified: false, complaints: 2 },
  { id: 5, full_name: 'Meera Iyer', email: 'meera@example.com', role: 'citizen', created_at: '2024-01-12', is_verified: true, complaints: 8 },
]

const roleColors = { citizen: 'primary', mp: 'warning', officer: 'info', admin: 'danger' }

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const filtered = mockUsers.filter(u => {
    const matchSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
    const matchRole = !roleFilter || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Users Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{filtered.length} users</p>
        </div>
        <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>Invite User</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input className="input-base pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-base w-full sm:w-36" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="mp">MP</option>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  {['User', 'Role', 'Joined', 'Complaints', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.full_name} size="sm" />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{u.full_name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={roleColors[u.role]} size="sm" className="capitalize">{u.role}</Badge>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">{u.complaints}</td>
                    <td className="px-5 py-4">
                      {u.is_verified
                        ? <Badge color="success" dot size="sm">Verified</Badge>
                        : <Badge color="warning" dot size="sm">Pending</Badge>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <button className="btn-ghost p-1.5 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
