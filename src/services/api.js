import { isFirebaseConfigured, auth, db, storage } from '../firebase/client'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword as fbUpdatePassword
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit as fsLimit,
  addDoc,
  deleteDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { CATEGORIES } from '../constants'

// ─── LOCAL STORAGE FALLBACK / DEMO MODE STATE ────────────────────────────────
const MOCK_VILLAGES = [
  { id: 'v1', name: 'Alipur', constituency_id: 'c1', population: 12000 },
  { id: 'v2', name: 'Narela', constituency_id: 'c1', population: 25000 },
  { id: 'v3', name: 'Kanjhawala', constituency_id: 'c1', population: 8000 }
]

const MOCK_WARDS = [
  { id: 'w1', name: 'Ward 1', ward_number: 1, constituency_id: 'c1' },
  { id: 'w2', name: 'Ward 2', ward_number: 2, constituency_id: 'c1' }
]

const MOCK_CONSTITUENCIES = [
  { id: 'c1', name: 'North Delhi', state: 'Delhi', district: 'North', mp_id: 'mp-demo-id', population: 580000, area_sq_km: 120 },
  { id: 'c2', name: 'Mumbai North', state: 'Maharashtra', district: 'Mumbai', mp_id: 'mp-demo-2', population: 1200000, area_sq_km: 85 }
]

const MOCK_SCHEMES = [
  { id: 's1', title: 'PM Awas Yojana (Gramin)', ministry: 'Ministry of Rural Development', emoji: '🏠', category: 'Housing', beneficiary_count: '2.95 crore' },
  { id: 's2', title: 'Pradhan Mantri Kisan Samman Nidhi', ministry: 'Ministry of Agriculture', emoji: '🌾', category: 'Agriculture', beneficiary_count: '11.5 crore' },
  { id: 's3', title: 'Ayushman Bharat PM-JAY', ministry: 'Ministry of Health', emoji: '🏥', category: 'Healthcare', beneficiary_count: '50 crore+' }
]

// Initialize LocalStorage-based DB if not present
const getLocalData = (key, defaultVal) => {
  const data = localStorage.getItem(`pp_${key}`)
  if (!data) {
    localStorage.setItem(`pp_${key}`, JSON.stringify(defaultVal))
    return defaultVal
  }
  return JSON.parse(data)
}

const saveLocalData = (key, data) => {
  localStorage.setItem(`pp_${key}`, JSON.stringify(data))
}

// ─── AUTH SERVICE ────────────────────────────────────────────────────────────
export const authService = {
  async signUp({ email, password, full_name, role = 'citizen', phone }) {
    if (!isFirebaseConfigured) {
      // Demo Signup
      const users = getLocalData('users', {})
      const id = 'demo-user-' + Math.random().toString(36).substr(2, 9)
      const userProfile = { id, email, full_name, role, phone, created_at: new Date().toISOString() }
      users[id] = userProfile
      saveLocalData('users', users)
      
      // Save current demo user
      localStorage.setItem('pp_current_user', JSON.stringify(userProfile))
      window.dispatchEvent(new Event('pp_auth_change'))
      return { user: { uid: id, email }, profile: userProfile }
    }

    const res = await createUserWithEmailAndPassword(auth, email, password)
    const userProfile = {
      id: res.user.uid,
      email,
      full_name,
      role,
      phone,
      created_at: new Date().toISOString(),
    }
    await setDoc(doc(db, 'users', res.user.uid), userProfile)
    return { user: res.user, profile: userProfile }
  },

  async signIn({ email, password }) {
    if (!isFirebaseConfigured) {
      // Demo Signin matching credentials
      const users = getLocalData('users', {})
      const matched = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
      
      if (matched) {
        localStorage.setItem('pp_current_user', JSON.stringify(matched))
        window.dispatchEvent(new Event('pp_auth_change'))
        return { user: { uid: matched.id, email }, profile: matched }
      }
      
      // Auto-create demo profile if they enter a demo email that doesn't exist
      const id = 'demo-' + email.split('@')[0]
      const defaultRole = email.includes('mp') ? 'mp' : email.includes('admin') ? 'admin' : email.includes('officer') ? 'officer' : 'citizen'
      const newDemoUser = {
        id,
        email,
        full_name: email.split('@')[0].toUpperCase(),
        role: defaultRole,
        created_at: new Date().toISOString()
      }
      users[id] = newDemoUser
      saveLocalData('users', users)
      localStorage.setItem('pp_current_user', JSON.stringify(newDemoUser))
      window.dispatchEvent(new Event('pp_auth_change'))
      return { user: { uid: id, email }, profile: newDemoUser }
    }

    const res = await signInWithEmailAndPassword(auth, email, password)
    return res
  },

  async signInWithGoogle() {
    if (!isFirebaseConfigured) {
      return this.signIn({ email: 'demo-google@priorities.gov.in', password: 'password123' })
    }
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)
    
    // Check if profile exists, if not create one
    const profileRef = doc(db, 'users', res.user.uid)
    const snap = await getDoc(profileRef)
    if (!snap.exists()) {
      const userProfile = {
        id: res.user.uid,
        email: res.user.email,
        full_name: res.user.displayName || 'Google User',
        role: 'citizen',
        avatar_url: res.user.photoURL,
        created_at: new Date().toISOString(),
      }
      await setDoc(profileRef, userProfile)
    }
    return res
  },

  async signInWithOTP(email) {
    if (!isFirebaseConfigured) {
      return { message: 'OTP Sent (Demo Mode)' }
    }
    // Firebase auth passwordless email link
    throw new Error('OTP/Passwordless Sign-In requires full email configuration. Please use password login.')
  },

  async verifyOTP({ email, token }) {
    if (!isFirebaseConfigured) {
      return this.signIn({ email, password: 'password123' })
    }
    throw new Error('OTP verification is simulated in Demo Mode. Please use Password Login.')
  },

  async resetPassword(email) {
    if (!isFirebaseConfigured) return true
    await sendPasswordResetEmail(auth, email)
  },

  async updatePassword(password) {
    if (!isFirebaseConfigured) return true
    if (auth.currentUser) {
      await fbUpdatePassword(auth.currentUser, password)
    }
  },

  async signOut() {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('pp_current_user')
      window.dispatchEvent(new Event('pp_auth_change'))
      return
    }
    await fbSignOut(auth)
  },

  async getSession() {
    if (!isFirebaseConfigured) {
      const user = localStorage.getItem('pp_current_user')
      return user ? JSON.parse(user) : null
    }
    return auth.currentUser
  },

  async getUser() {
    return this.getSession()
  }
}

// ─── USER SERVICE ────────────────────────────────────────────────────────────
export const userService = {
  async getProfile(userId) {
    if (!isFirebaseConfigured) {
      const users = getLocalData('users', {})
      if (users[userId]) return users[userId]
      // Fallback current user
      const curr = localStorage.getItem('pp_current_user')
      if (curr) {
        const parsed = JSON.parse(curr)
        if (parsed.id === userId) return parsed
      }
      return { id: userId, email: 'demo@test.com', full_name: 'Demo Citizen', role: 'citizen' }
    }

    const snap = await getDoc(doc(db, 'users', userId))
    if (!snap.exists()) throw new Error('Profile not found')
    return snap.data()
  },

  async updateProfile(userId, updates) {
    if (!isFirebaseConfigured) {
      const users = getLocalData('users', {})
      if (users[userId]) {
        users[userId] = { ...users[userId], ...updates }
        saveLocalData('users', users)
        
        const curr = localStorage.getItem('pp_current_user')
        if (curr) {
          const parsed = JSON.parse(curr)
          if (parsed.id === userId) {
            localStorage.setItem('pp_current_user', JSON.stringify(users[userId]))
          }
        }
      }
      return users[userId]
    }

    const ref = doc(db, 'users', userId)
    await updateDoc(ref, updates)
    const updated = await getDoc(ref)
    return updated.data()
  },

  async getAllUsers({ page = 1, limit = 20, role, search } = {}) {
    if (!isFirebaseConfigured) {
      const users = Object.values(getLocalData('users', {}))
      let filtered = users
      if (role) filtered = filtered.filter(u => u.role === role)
      if (search) filtered = filtered.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()))
      return { data: filtered.slice((page - 1) * limit, page * limit), count: filtered.length }
    }

    const col = collection(db, 'users')
    let snap
    if (role) {
      snap = await getDocs(query(col, where('role', '==', role)))
    } else {
      snap = await getDocs(col)
    }

    let list = snap.docs.map(d => d.data())
    if (search) {
      list = list.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()))
    }
    return { data: list.slice((page - 1) * limit, page * limit), count: list.length }
  }
}

// ─── COMPLAINTS SERVICE ──────────────────────────────────────────────────────
export const complaintService = {
  async create(payload) {
    const freshPayload = {
      ...payload,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes: 0,
      comments_count: 0
    }

    if (!isFirebaseConfigured) {
      const complaints = getLocalData('complaints', [])
      freshPayload.id = 'comp-' + Math.random().toString(36).substr(2, 9)
      complaints.push(freshPayload)
      saveLocalData('complaints', complaints)
      return freshPayload
    }

    const ref = await addDoc(collection(db, 'complaints'), freshPayload)
    await updateDoc(ref, { id: ref.id })
    return { ...freshPayload, id: ref.id }
  },

  async getById(id) {
    if (!isFirebaseConfigured) {
      const complaints = getLocalData('complaints', [])
      const matched = complaints.find(c => c.id === id)
      if (!matched) throw new Error('Complaint not found')
      
      const comments = getLocalData(`comments_${id}`, [])
      const votes = getLocalData(`votes_${id}`, [])
      return {
        ...matched,
        users: { full_name: matched.citizen_name || 'Citizen User' },
        categories: CATEGORIES.find(cat => cat.id === Number(matched.category_id)) || { name: 'Other', color: '#6366f1' },
        votes,
        comments
      }
    }

    const snap = await getDoc(doc(db, 'complaints', id))
    if (!snap.exists()) throw new Error('Complaint not found')
    
    const complaint = snap.data()
    
    // Fetch comments
    const commentSnap = await getDocs(collection(db, 'complaints', id, 'comments'))
    const comments = commentSnap.docs.map(d => d.data())

    // Fetch votes
    const votesSnap = await getDocs(collection(db, 'complaints', id, 'votes'))
    const votes = votesSnap.docs.map(d => d.data())

    return {
      ...complaint,
      votes,
      comments,
      categories: CATEGORIES.find(c => c.id === Number(complaint.category_id)) || { name: 'Other', color: '#6366f1' }
    }
  },

  async getAll({ page = 1, limit = 10, status, category_id, constituency_id, priority, search } = {}) {
    if (!isFirebaseConfigured) {
      let list = getLocalData('complaints', [])
      if (status) list = list.filter(c => c.status === status)
      if (category_id) list = list.filter(c => Number(c.category_id) === Number(category_id))
      if (priority) list = list.filter(c => c.priority === priority)
      if (search) list = list.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()))
      
      const formatted = list.map(c => ({
        ...c,
        categories: CATEGORIES.find(cat => cat.id === Number(c.category_id)) || { name: 'Other', color: '#6366f1' }
      }))

      return { data: formatted.slice((page - 1) * limit, page * limit), count: formatted.length }
    }

    const col = collection(db, 'complaints')
    let q = query(col, orderBy('created_at', 'desc'))

    if (status) q = query(q, where('status', '==', status))
    if (category_id) q = query(q, where('category_id', '==', Number(category_id)))
    if (priority) q = query(q, where('priority', '==', priority))

    const snap = await getDocs(q)
    let list = snap.docs.map(d => d.data())

    if (search) {
      list = list.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()))
    }

    const formatted = list.map(c => ({
      ...c,
      categories: CATEGORIES.find(cat => cat.id === Number(c.category_id)) || { name: 'Other', color: '#6366f1' }
    }))

    return { data: formatted.slice((page - 1) * limit, page * limit), count: formatted.length }
  },

  async getMine(userId, params = {}) {
    if (!isFirebaseConfigured) {
      const res = await this.getAll(params)
      res.data = res.data.filter(c => c.citizen_id === userId)
      return res
    }
    const col = collection(db, 'complaints')
    const q = query(col, where('citizen_id', '==', userId), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    const list = snap.docs.map(d => d.data())
    return { data: list, count: list.length }
  },

  async update(id, updates) {
    const updatedFields = { ...updates, updated_at: new Date().toISOString() }

    if (!isFirebaseConfigured) {
      const complaints = getLocalData('complaints', [])
      const index = complaints.findIndex(c => c.id === id)
      if (index !== -1) {
        complaints[index] = { ...complaints[index], ...updatedFields }
        saveLocalData('complaints', complaints)
        return complaints[index]
      }
      throw new Error('Complaint not found')
    }

    const ref = doc(db, 'complaints', id)
    await updateDoc(ref, updatedFields)
    const updated = await getDoc(ref)
    return updated.data()
  },

  async vote(complaintId, userId, voteType) {
    if (!isFirebaseConfigured) {
      const votes = getLocalData(`votes_${complaintId}`, [])
      const matchedIdx = votes.findIndex(v => v.user_id === userId)
      
      let modifier = 0
      if (matchedIdx !== -1) {
        const prev = votes[matchedIdx].vote_type
        if (prev === voteType) {
          votes.splice(matchedIdx, 1)
          modifier = -1
        } else {
          votes[matchedIdx].vote_type = voteType
          modifier = 0 // type flipped, total stays same or changes depending on scoring system. Let's simplify
        }
      } else {
        votes.push({ user_id: userId, vote_type: voteType })
        modifier = 1
      }
      saveLocalData(`votes_${complaintId}`, votes)

      // update count on complaint
      const complaints = getLocalData('complaints', [])
      const cIdx = complaints.findIndex(c => c.id === complaintId)
      if (cIdx !== -1) {
        complaints[cIdx].upvotes = (complaints[cIdx].upvotes || 0) + modifier
        saveLocalData('complaints', complaints)
      }
      return votes
    }

    const voteRef = doc(db, 'complaints', complaintId, 'votes', userId)
    const voteSnap = await getDoc(voteRef)
    
    let change = 0
    if (voteSnap.exists()) {
      if (voteSnap.data().vote_type === voteType) {
        await deleteDoc(voteRef)
        change = -1
      } else {
        await updateDoc(voteRef, { vote_type: voteType })
      }
    } else {
      await setDoc(voteRef, { user_id: userId, vote_type: voteType })
      change = 1
    }

    const ref = doc(db, 'complaints', complaintId)
    await updateDoc(ref, { upvotes: increment(change) })
    return { success: true }
  },

  async addComment(complaintId, userId, content) {
    const newComment = {
      id: 'comm-' + Math.random().toString(36).substr(2, 9),
      content,
      user_id: userId,
      created_at: new Date().toISOString()
    }

    if (!isFirebaseConfigured) {
      const comments = getLocalData(`comments_${complaintId}`, [])
      comments.push(newComment)
      saveLocalData(`comments_${complaintId}`, comments)

      // increment comment count
      const complaints = getLocalData('complaints', [])
      const cIdx = complaints.findIndex(c => c.id === complaintId)
      if (cIdx !== -1) {
        complaints[cIdx].comments_count = (complaints[cIdx].comments_count || 0) + 1
        saveLocalData('complaints', complaints)
      }
      return { ...newComment, users: { full_name: 'Demo User' } }
    }

    const ref = await addDoc(collection(db, 'complaints', complaintId, 'comments'), newComment)
    await updateDoc(doc(db, 'complaints', complaintId), { comments_count: increment(1) })
    return { ...newComment, id: ref.id, users: { full_name: auth.currentUser?.displayName || 'User' } }
  },

  async getStats() {
    if (!isFirebaseConfigured) {
      const complaints = getLocalData('complaints', [])
      return {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        open: complaints.filter(c => c.status === 'open').length,
        in_progress: complaints.filter(c => c.status === 'in_progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        closed: complaints.filter(c => c.status === 'closed').length,
      }
    }

    const snap = await getDocs(collection(db, 'complaints'))
    const list = snap.docs.map(d => d.data())
    return {
      total: list.length,
      pending: list.filter(c => c.status === 'pending').length,
      open: list.filter(c => c.status === 'open').length,
      in_progress: list.filter(c => c.status === 'in_progress').length,
      resolved: list.filter(c => c.status === 'resolved').length,
      closed: list.filter(c => c.status === 'closed').length,
    }
  }
}

// ─── PROJECTS SERVICE ────────────────────────────────────────────────────────
export const projectService = {
  async create(payload) {
    const newProj = {
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completion_percentage: 0
    }

    if (!isFirebaseConfigured) {
      const projects = getLocalData('projects', [])
      newProj.id = 'proj-' + Math.random().toString(36).substr(2, 9)
      projects.push(newProj)
      saveLocalData('projects', projects)
      return newProj
    }

    const ref = await addDoc(collection(db, 'projects'), newProj)
    await updateDoc(ref, { id: ref.id })
    return { ...newProj, id: ref.id }
  },

  async getAll({ page = 1, limit = 10, status } = {}) {
    if (!isFirebaseConfigured) {
      let list = getLocalData('projects', [])
      if (status) list = list.filter(p => p.status === status)
      return { data: list.slice((page - 1) * limit, page * limit), count: list.length }
    }

    const col = collection(db, 'projects')
    let q = query(col, orderBy('created_at', 'desc'))
    if (status) q = query(q, where('status', '==', status))

    const snap = await getDocs(q)
    const list = snap.docs.map(d => d.data())
    return { data: list.slice((page - 1) * limit, page * limit), count: list.length }
  },

  async getById(id) {
    if (!isFirebaseConfigured) {
      const list = getLocalData('projects', [])
      const matched = list.find(p => p.id === id)
      if (!matched) throw new Error('Project not found')
      const updates = getLocalData(`project_updates_${id}`, [])
      return { ...matched, project_updates: updates, budgets: { allocated: 5000000, spent: 1200000 } }
    }

    const snap = await getDoc(doc(db, 'projects', id))
    if (!snap.exists()) throw new Error('Project not found')
    const updatesSnap = await getDocs(collection(db, 'projects', id, 'updates'))
    return {
      ...snap.data(),
      project_updates: updatesSnap.docs.map(d => d.data()),
      budgets: { allocated: 5000000, spent: 1200000 }
    }
  },

  async update(id, updates) {
    if (!isFirebaseConfigured) {
      const projects = getLocalData('projects', [])
      const index = projects.findIndex(p => p.id === id)
      if (index !== -1) {
        projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() }
        saveLocalData('projects', projects)
        return projects[index]
      }
      throw new Error('Project not found')
    }

    const ref = doc(db, 'projects', id)
    await updateDoc(ref, { ...updates, updated_at: new Date().toISOString() })
    const snap = await getDoc(ref)
    return snap.data()
  },

  async addUpdate(projectId, userId, payload) {
    const updateObj = {
      id: 'upd-' + Math.random().toString(36).substr(2, 9),
      ...payload,
      user_id: userId,
      created_at: new Date().toISOString()
    }

    if (!isFirebaseConfigured) {
      const list = getLocalData(`project_updates_${projectId}`, [])
      list.push(updateObj)
      saveLocalData(`project_updates_${projectId}`, list)
      return updateObj
    }

    await addDoc(collection(db, 'projects', projectId, 'updates'), updateObj)
    return updateObj
  }
}

// ─── NOTIFICATION SERVICE ────────────────────────────────────────────────────
export const notificationService = {
  async getAll(userId) {
    if (!isFirebaseConfigured) {
      return getLocalData(`notifications_${userId}`, [])
    }
    const q = query(collection(db, 'notifications'), where('user_id', '==', userId), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data())
  },

  async markRead(id) {
    if (!isFirebaseConfigured) {
      const curr = localStorage.getItem('pp_current_user')
      if (curr) {
        const uid = JSON.parse(curr).id
        const list = getLocalData(`notifications_${uid}`, [])
        const matched = list.find(n => n.id === id)
        if (matched) matched.is_read = true
        saveLocalData(`notifications_${uid}`, list)
      }
      return
    }
    await updateDoc(doc(db, 'notifications', id), { is_read: true })
  },

  async markAllRead(userId) {
    if (!isFirebaseConfigured) {
      const list = getLocalData(`notifications_${userId}`, [])
      list.forEach(n => n.is_read = true)
      saveLocalData(`notifications_${userId}`, list)
      return
    }
    const snap = await getDocs(query(collection(db, 'notifications'), where('user_id', '==', userId)))
    const batch = snap.docs.map(d => updateDoc(d.ref, { is_read: true }))
    await Promise.all(batch)
  }
}

// ─── CONSTITUENCY SERVICE ────────────────────────────────────────────────────
export const constituencyService = {
  async getAll() {
    return MOCK_CONSTITUENCIES
  },
  async getById(id) {
    const matched = MOCK_CONSTITUENCIES.find(c => c.id === id)
    if (!matched) throw new Error('Constituency not found')
    return { ...matched, villages: MOCK_VILLAGES, wards: MOCK_WARDS }
  }
}

// ─── STORAGE SERVICE ──────────────────────────────────────────────────────────
export const storageService = {
  async uploadFile(bucket, filePath, file) {
    if (!isFirebaseConfigured) {
      return { path: filePath, url: URL.createObjectURL(file) }
    }
    const fileRef = ref(storage, `${bucket}/${filePath}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    return { path: filePath, url }
  },

  async deleteFile(bucket, filePath) {
    if (!isFirebaseConfigured) return
    const fileRef = ref(storage, `${bucket}/${filePath}`)
    await deleteObject(fileRef)
  },

  getPublicUrl(bucket, path) {
    return path
  }
}

// ─── REPORT SERVICE ──────────────────────────────────────────────────────────
export const reportService = {
  async getAll() {
    return [
      { id: 'rep1', title: 'Monthly Resolution Audit - June 2026', type: 'Audit', created_at: new Date().toISOString() },
      { id: 'rep2', title: 'Constituency Development Fund Usage', type: 'Finance', created_at: new Date().toISOString() }
    ]
  }
}

// ─── DEPARTMENT SERVICE ──────────────────────────────────────────────────────
export const departmentService = {
  async getAll() {
    if (!isFirebaseConfigured) {
      return getLocalData('departments', [
        { id: 'd1', name: 'Public Works Department (PWD)', code: 'PWD' },
        { id: 'd2', name: 'Water & Sanitation Dept', code: 'WSD' },
        { id: 'd3', name: 'Electricity Board', code: 'EB' }
      ])
    }
    const snap = await getDocs(collection(db, 'departments'))
    return snap.docs.map(d => d.data())
  },

  async create(payload) {
    if (!isFirebaseConfigured) {
      const list = getLocalData('departments', [])
      const newD = { id: 'd-' + Math.random().toString(36).substr(2, 9), ...payload }
      list.push(newD)
      saveLocalData('departments', list)
      return newD
    }
    const ref = await addDoc(collection(db, 'departments'), payload)
    await updateDoc(ref, { id: ref.id })
    return { ...payload, id: ref.id }
  },

  async update(id, updates) {
    if (!isFirebaseConfigured) {
      const list = getLocalData('departments', [])
      const index = list.findIndex(d => d.id === id)
      if (index !== -1) {
        list[index] = { ...list[index], ...updates }
        saveLocalData('departments', list)
        return list[index]
      }
      throw new Error('Department not found')
    }
    const ref = doc(db, 'departments', id)
    await updateDoc(ref, updates)
    const snap = await getDoc(ref)
    return snap.data()
  }
}

// ─── SCHEME SERVICE ──────────────────────────────────────────────────────────
export const schemeService = {
  async getAll() {
    return MOCK_SCHEMES
  }
}
