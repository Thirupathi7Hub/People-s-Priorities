import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Lock, Globe, Palette, Shield, Save } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useTheme } from '../contexts/ThemeContext'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email_complaints: true,
    email_comments: true,
    email_projects: false,
    push_all: true,
    sms_updates: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ checked, onChange, id }) => (
    <button
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-[var(--bg-tertiary)]'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your app preferences</p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-sm text-green-700">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Appearance */}
      <Card>
        <CardHeader><CardTitle><Palette className="w-4 h-4 inline mr-2" />Appearance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Dark Mode</p>
              <p className="text-xs text-[var(--text-muted)]">Toggle between light and dark theme</p>
            </div>
            <Toggle checked={isDark} onChange={toggleTheme} id="dark-mode" />
          </div>

          <div className="border-t border-[var(--border-color)] pt-4">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Theme Color</p>
            <div className="flex gap-3">
              {['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'].map(c => (
                <button key={c} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-[var(--text-primary)] transition-all"
                  style={{ background: c }} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle><Bell className="w-4 h-4 inline mr-2" />Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email_complaints', label: 'Email: Complaint Updates', desc: 'Receive emails when your complaints are updated' },
            { key: 'email_comments', label: 'Email: New Comments', desc: 'Get notified when someone comments on your complaints' },
            { key: 'email_projects', label: 'Email: Project Updates', desc: 'Updates on ongoing projects in your constituency' },
            { key: 'push_all', label: 'Push Notifications', desc: 'Enable in-app push notifications' },
            { key: 'sms_updates', label: 'SMS Alerts', desc: 'Receive critical updates via SMS' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{n.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{n.desc}</p>
              </div>
              <Toggle
                id={n.key}
                checked={notifications[n.key]}
                onChange={v => setNotifications(p => ({ ...p, [n.key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader><CardTitle><Shield className="w-4 h-4 inline mr-2" />Privacy & Security</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Profile Visibility', desc: 'Control who can see your profile' },
            { label: 'Anonymous Complaints', desc: 'Allow submitting complaints without showing name' },
            { label: 'Location Sharing', desc: 'Share location data with complaints' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{s.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
              </div>
              <Toggle id={`privacy-${i}`} checked={i !== 1} onChange={() => {}} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader><CardTitle className="text-red-500">⚠ Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Delete Account</p>
              <p className="text-xs text-[var(--text-muted)]">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" leftIcon={<Save className="w-4 h-4" />}>
        Save All Settings
      </Button>
    </div>
  )
}
