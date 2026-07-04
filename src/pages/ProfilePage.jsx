import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Camera, Save, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { useTheme } from '../contexts/ThemeContext'

const roleLabels = { citizen: 'Citizen', mp: 'Member of Parliament', officer: 'Department Officer', admin: 'Administrator' }

export default function ProfilePage() {
  const { user, profile, role, refreshProfile } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await userService.updateProfile(user.id, formData)
      await refreshProfile()
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Profile</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your account information</p>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-sm text-green-700 flex items-center gap-2">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Avatar Card */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <Avatar
              src={profile?.avatar_url}
              name={formData.full_name}
              size="2xl"
              ring
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{formData.full_name || 'User'}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <Badge color="primary"><Shield className="w-3 h-3" /> {roleLabels[role]}</Badge>
              {profile?.is_verified && <Badge color="success">✓ Verified</Badge>}
            </div>
          </div>
          <div className="sm:ml-auto">
            <Button
              variant={editing ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => editing ? setEditing(false) : setEditing(true)}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
            disabled={!editing}
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input
            label="Email Address"
            value={user?.email || ''}
            disabled
            leftIcon={<Mail className="w-4 h-4" />}
            hint="Email cannot be changed"
          />
          <Input
            label="Mobile Number"
            value={formData.phone}
            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
            disabled={!editing}
            leftIcon={<Phone className="w-4 h-4" />}
            placeholder="+91 98765 43210"
          />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Bio</label>
            <textarea
              className="input-base resize-none"
              rows={3}
              value={formData.bio}
              onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
              disabled={!editing}
              placeholder="Tell us about yourself..."
            />
          </div>
          <Input
            label="Address"
            value={formData.address}
            onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
            disabled={!editing}
            placeholder="Your full address"
          />
          {editing && (
            <div className="flex justify-end">
              <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Dark Mode</p>
              <p className="text-xs text-[var(--text-muted)]">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary-500' : 'bg-[var(--bg-tertiary)]'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="border-t border-[var(--border-color)] pt-4">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Member since</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
