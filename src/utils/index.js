import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date, fmt = 'dd MMM yyyy') {
  if (!date) return '—'
  return format(new Date(date), fmt)
}

export function formatRelativeTime(date) {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num) {
  if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(1)}Cr`
  if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(1)}L`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return String(num)
}

export function truncate(str, len = 60) {
  if (!str) return ''
  return str.length > len ? `${str.slice(0, len)}…` : str
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function generateSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key]
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
}

export function buildQueryString(params) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v)
  })
  return q.toString()
}

export function getStatusColor(status) {
  const map = {
    pending: '#f59e0b',
    open: '#3b82f6',
    in_progress: '#8b5cf6',
    resolved: '#22c55e',
    closed: '#6b7280',
    rejected: '#ef4444',
  }
  return map[status] || '#6b7280'
}

export function getPriorityColor(priority) {
  const map = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  }
  return map[priority] || '#6b7280'
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function validateFileSize(file, maxMB = 10) {
  return file.size <= maxMB * 1024 * 1024
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
