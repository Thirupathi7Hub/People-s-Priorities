import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { PublicLayout } from '../components/layouts/PublicLayout'
import DashboardLayout from '../components/layouts/DashboardLayout'
import { PageSkeleton } from '../components/ui/Skeleton'
import { ROLES } from '../constants'

// Public pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'))
const AboutPage = lazy(() => import('../pages/public/AboutPage'))
const FeaturesPage = lazy(() => import('../pages/public/FeaturesPage'))
const ContactPage = lazy(() => import('../pages/public/ContactPage'))
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'))

// Auth pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'))
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage'))

// Dashboards
const CitizenDashboard = lazy(() => import('../pages/dashboards/CitizenDashboard'))
const MPDashboard = lazy(() => import('../pages/dashboards/MPDashboard'))
const OfficerDashboard = lazy(() => import('../pages/dashboards/OfficerDashboard'))
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'))

// Shared pages
const ComplaintsListPage = lazy(() => import('../pages/complaints/ComplaintsListPage'))
const NewComplaintPage = lazy(() => import('../pages/complaints/NewComplaintPage'))
const ComplaintDetailPage = lazy(() => import('../pages/complaints/ComplaintDetailPage'))
const MapViewPage = lazy(() => import('../pages/MapViewPage'))
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))

// MP-specific pages
const MPAnalyticsPage = lazy(() => import('../pages/mp/MPAnalyticsPage'))
const MPAssignPage = lazy(() => import('../pages/mp/MPAssignPage'))

// Officer-specific pages
const OfficerPerformancePage = lazy(() => import('../pages/officer/OfficerPerformancePage'))

// Admin pages
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'))
const AdminDepartmentsPage = lazy(() => import('../pages/admin/AdminDepartmentsPage'))
const AdminConstituenciesPage = lazy(() => import('../pages/admin/AdminConstituenciesPage'))
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'))

const Loader = () => (
  <div className="p-6">
    <PageSkeleton />
  </div>
)

const wrap = (component, roles) => (
  <ProtectedRoute allowedRoles={roles}>
    <Suspense fallback={<Loader />}>
      {component}
    </Suspense>
  </ProtectedRoute>
)

const router = createBrowserRouter([
  // ─── Public ────────────────────────────────────────────────────────────────
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Suspense fallback={<div />}><LandingPage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<div />}><AboutPage /></Suspense> },
      { path: 'features', element: <Suspense fallback={<div />}><FeaturesPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<div />}><ContactPage /></Suspense> },
    ],
  },

  // ─── Auth ──────────────────────────────────────────────────────────────────
  {
    path: '/auth',
    children: [
      { path: 'login', element: <PublicOnlyRoute><Suspense fallback={<div />}><LoginPage /></Suspense></PublicOnlyRoute> },
      { path: 'register', element: <PublicOnlyRoute><Suspense fallback={<div />}><RegisterPage /></Suspense></PublicOnlyRoute> },
      { path: 'forgot-password', element: <Suspense fallback={<div />}><ForgotPasswordPage /></Suspense> },
      { path: 'callback', element: <Suspense fallback={<div />}><AuthCallbackPage /></Suspense> },
    ],
  },

  // ─── CITIZEN ───────────────────────────────────────────────────────────────
  // Features: Register/Login | Submit complaint (text+image) | Category |
  //           Share location | Track status | View resolved | Notifications
  {
    path: '/dashboard/citizen',
    element: wrap(<DashboardLayout />, [ROLES.CITIZEN, ROLES.ADMIN]),
    children: [
      { index: true, element: <Suspense fallback={<Loader />}><CitizenDashboard /></Suspense> },
      { path: 'complaints', element: <Suspense fallback={<Loader />}><ComplaintsListPage role="citizen" /></Suspense> },
      { path: 'complaints/new', element: <Suspense fallback={<Loader />}><NewComplaintPage /></Suspense> },
      { path: 'complaints/:id', element: <Suspense fallback={<Loader />}><ComplaintDetailPage /></Suspense> },
      { path: 'map', element: <Suspense fallback={<Loader />}><MapViewPage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<Loader />}><NotificationsPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<Loader />}><ProfilePage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Loader />}><SettingsPage /></Suspense> },
    ],
  },

  // ─── MP / MINISTER ─────────────────────────────────────────────────────────
  // Features: All constituency complaints | AI Top Priorities | Heatmap |
  //           Category analytics | Assign to Officers | Progress | PDF Report
  {
    path: '/dashboard/mp',
    element: wrap(<DashboardLayout />, [ROLES.MP, ROLES.ADMIN]),
    children: [
      { index: true, element: <Suspense fallback={<Loader />}><MPDashboard /></Suspense> },
      { path: 'complaints', element: <Suspense fallback={<Loader />}><ComplaintsListPage role="mp" /></Suspense> },
      { path: 'complaints/:id', element: <Suspense fallback={<Loader />}><ComplaintDetailPage /></Suspense> },
      { path: 'priorities', element: <Suspense fallback={<Loader />}><MPDashboard /></Suspense> },
      { path: 'map', element: <Suspense fallback={<Loader />}><MapViewPage /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<Loader />}><MPAnalyticsPage /></Suspense> },
      { path: 'assign', element: <Suspense fallback={<Loader />}><MPAssignPage /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<Loader />}><ReportsPage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<Loader />}><NotificationsPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<Loader />}><ProfilePage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Loader />}><SettingsPage /></Suspense> },
    ],
  },

  // ─── SOLVER OFFICER ────────────────────────────────────────────────────────
  // Features: View assigned complaints | Update status | Upload proof images |
  //           Mark resolved | Add notes | Personal performance stats
  {
    path: '/dashboard/officer',
    element: wrap(<DashboardLayout />, [ROLES.OFFICER, ROLES.ADMIN]),
    children: [
      { index: true, element: <Suspense fallback={<Loader />}><OfficerDashboard /></Suspense> },
      { path: 'complaints', element: <Suspense fallback={<Loader />}><ComplaintsListPage role="officer" /></Suspense> },
      { path: 'complaints/:id', element: <Suspense fallback={<Loader />}><ComplaintDetailPage /></Suspense> },
      { path: 'update', element: <Suspense fallback={<Loader />}><ComplaintsListPage role="officer" /></Suspense> },
      { path: 'performance', element: <Suspense fallback={<Loader />}><OfficerPerformancePage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<Loader />}><NotificationsPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<Loader />}><ProfilePage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Loader />}><SettingsPage /></Suspense> },
    ],
  },

  // ─── ADMIN ─────────────────────────────────────────────────────────────────
  {
    path: '/dashboard/admin',
    element: wrap(<DashboardLayout />, [ROLES.ADMIN]),
    children: [
      { index: true, element: <Suspense fallback={<Loader />}><AdminDashboard /></Suspense> },
      { path: 'users', element: <Suspense fallback={<Loader />}><AdminUsersPage /></Suspense> },
      { path: 'complaints', element: <Suspense fallback={<Loader />}><ComplaintsListPage role="admin" /></Suspense> },
      { path: 'complaints/:id', element: <Suspense fallback={<Loader />}><ComplaintDetailPage /></Suspense> },
      { path: 'departments', element: <Suspense fallback={<Loader />}><AdminDepartmentsPage /></Suspense> },
      { path: 'constituencies', element: <Suspense fallback={<Loader />}><AdminConstituenciesPage /></Suspense> },
      { path: 'categories', element: <Suspense fallback={<Loader />}><AdminCategoriesPage /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<Loader />}><ReportsPage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<Loader />}><NotificationsPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Loader />}><SettingsPage /></Suspense> },
    ],
  },

  // ─── Misc ──────────────────────────────────────────────────────────────────
  {
    path: '/unauthorized',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h1>
          <p className="text-[var(--text-secondary)]">You don't have permission to view this page.</p>
        </div>
      </div>
    ),
  },
  { path: '*', element: <Suspense fallback={<div />}><NotFoundPage /></Suspense> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
