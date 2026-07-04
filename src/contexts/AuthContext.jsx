import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { isFirebaseConfigured, auth } from '../firebase/client'
import { onAuthStateChanged } from 'firebase/auth'
import { userService } from '../services/api'
import { ROLES, DASHBOARD_ROUTES } from '../constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId, fbUser) => {
    try {
      const data = await userService.getProfile(userId)
      setProfile(data)
      return data
    } catch (e) {
      console.warn('Profile not found, creating default profile:', e)
      if (fbUser) {
        try {
          const defaultProfile = {
            id: userId,
            email: fbUser.email,
            full_name: fbUser.displayName || 'Citizen User',
            role: ROLES.CITIZEN,
            constituency_id: null,
            created_at: new Date().toISOString()
          }
          await userService.updateProfile(userId, defaultProfile)
          setProfile(defaultProfile)
          return defaultProfile
        } catch (createErr) {
          console.error('Failed to create default profile:', createErr)
        }
      }
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    if (!isFirebaseConfigured) {
      // Demo Mode Auth Listener
      const checkDemoAuth = () => {
        if (!mounted) return
        const cached = localStorage.getItem('pp_current_user')
        if (cached) {
          const parsed = JSON.parse(cached)
          setUser({ uid: parsed.id, email: parsed.email })
          setProfile(parsed)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }

      checkDemoAuth()
      window.addEventListener('pp_auth_change', checkDemoAuth)
      return () => {
        mounted = false
        window.removeEventListener('pp_auth_change', checkDemoAuth)
      }
    }

    // Real Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!mounted) return
      if (fbUser) {
        setUser(fbUser)
        await fetchProfile(fbUser.uid, fbUser)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [fetchProfile])

  const role = profile?.role || ROLES.CITIZEN

  const value = {
    user,
    profile,
    loading,
    role,
    isAuthenticated: !!user,
    isCitizen:  role === ROLES.CITIZEN,
    isMP:       role === ROLES.MP,
    isOfficer:  role === ROLES.OFFICER,
    isAdmin:    role === ROLES.ADMIN,
    dashboardRoute: DASHBOARD_ROUTES[role] || '/dashboard/citizen',
    refreshProfile: () => user && fetchProfile(user.uid || user.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
