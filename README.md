# 🗳️ People's Priorities

> **Bridging Citizens and Government — One Complaint at a Time**

A smart civic complaint & governance platform where citizens submit local issues, MPs get AI-driven insights, and Solver Officers resolve them — all in real-time.

🌐 **Live Demo:** [people-s-priorities.vercel.app](https://people-s-priorities.vercel.app)

---

## 📸 Screenshots

| Citizen Dashboard | MP Analytics | Officer Update |
|---|---|---|
| Submit & track complaints | AI priorities + charts | Inline status updates |

---

## 🎯 Problem Statement

- Citizens struggle to report local issues (roads, water, electricity) formally
- Complaints are lost in calls, paperwork, and informal channels
- MPs have **no real-time data** on their constituency's top problems
- Solver Officers work **without accountability** or tracking
- Zero transparency between government and the public

---

## ✅ Our Solution

**People's Priorities** is a three-role web platform:

| 👤 Citizen | 🏛️ MP / Minister | 🛠️ Solver Officer |
|---|---|---|
| Submit complaints (text + image) | View all constituency complaints | View assigned complaints |
| Choose category | AI-generated Top Priorities | Update status inline |
| Share GPS location | Heatmap of issue hotspots | Upload proof / add notes |
| Track complaint status | Category-wise analytics | Mark issues as resolved |
| Receive notifications | Assign issues to officers | View personal performance stats |
| View resolved complaints | Download monthly report (PDF) | Monthly activity charts |

---

## 🚀 Features

### 👤 Citizen (Client)
- ✅ Register / Login (Google or Email)
- ✅ Submit complaint with **text + image + GPS location**
- ✅ Choose from 10+ categories (Road, Water, Electricity, Health, Sanitation…)
- ✅ Real-time complaint status tracking
- ✅ View all complaints and resolved history
- ✅ Notifications on status change

### 🏛️ MP Dashboard
- ✅ View **all constituency complaints** live from Firestore
- ✅ **AI-generated Top Priorities** from complaint data
- ✅ **Heatmap** of issue hotspots (GPS-based)
- ✅ Category-wise analytics with charts
- ✅ **Assign complaints to Solver Officers**
- ✅ Resolution progress tracking
- ✅ Monthly PDF report download

### 🛠️ Solver Officer
- ✅ View assigned cases
- ✅ **Inline status updates** (Open → In Progress → Resolved)
- ✅ Add resolution notes per complaint
- ✅ Upload proof images after resolution
- ✅ Personal **performance stats dashboard**
- ✅ Monthly activity & resolution rate charts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Routing** | React Router DOM v6 |
| **Styling** | Vanilla CSS (custom design system) |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Map** | Leaflet.js + OpenStreetMap |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Storage** | Firebase Storage |
| **AI Insights** | Google Gemini API |
| **Hosting** | Vercel |
| **Icons** | Lucide React |

---

## 🏗️ Project Structure

```
peoples-priorities/
├── src/
│   ├── components/
│   │   ├── layouts/          # Sidebar, DashboardLayout, Header
│   │   └── ui/               # Button, Card, Badge, Input, Modal...
│   ├── contexts/
│   │   ├── AuthContext.jsx   # Firebase Auth context
│   │   └── ThemeContext.jsx  # Dark/light mode
│   ├── pages/
│   │   ├── auth/             # Login, Register, Forgot Password
│   │   ├── complaints/       # List, New, Detail pages
│   │   ├── dashboards/       # Citizen, MP, Officer, Admin
│   │   ├── mp/               # MPAnalyticsPage, MPAssignPage
│   │   ├── officer/          # OfficerPerformancePage, OfficerUpdatePage
│   │   ├── admin/            # Users, Departments, Categories
│   │   └── public/           # Landing, About, Features, Contact
│   ├── routes/
│   │   └── AppRouter.jsx     # Role-based protected routing
│   ├── services/
│   │   └── api.js            # Firebase Firestore service layer
│   └── constants/
│       └── index.js          # CATEGORIES, ROLES, CHART_COLORS
├── vercel.json               # SPA routing config
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (Firestore + Auth enabled)

### 1. Clone the Repository
```bash
git clone https://github.com/Thirupathi7Hub/People-s-Priorities.git
cd People-s-Priorities
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Citizen | citizen@priorities.gov.in | Demo@1234 |
| 🏛️ MP | mp@priorities.gov.in | Demo@1234 |
| 🛠️ Officer | officer@priorities.gov.in | Demo@1234 |

> ℹ️ Demo accounts are auto-provisioned on first login.

---

## 🗺️ Role-Based Routes

| Role | Base Path |
|---|---|
| Citizen | `/dashboard/citizen` |
| MP | `/dashboard/mp` |
| Officer | `/dashboard/officer` |
| Admin | `/dashboard/admin` |

---

## 🌐 Deployment

Deployed on **Vercel** with SPA routing configured via `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Push to `main` branch → Vercel auto-deploys.

---

## 🤖 AI Integration

The **MP Dashboard** uses the **Google Gemini API** to:
- Analyze complaint patterns across categories
- Generate prioritized top issues list
- Surface urgent hotspots requiring immediate attention

---

## 📊 Database Structure (Firestore)

```
/users/{userId}
  - email, full_name, role, created_at

/complaints/{complaintId}
  - title, description, status, priority
  - citizen_id, citizen_name
  - category_id, location_text
  - location_lat, location_lng
  - assigned_officer_id
  - resolution_note
  - created_at, updated_at

/complaints/{id}/comments/{commentId}
  - content, user_id, user_name, created_at

/complaints/{id}/votes/{userId}
  - vote_type (up/down)
```

---

## 🗺️ Roadmap

- [ ] 📱 Mobile app (React Native)
- [ ] 🌐 Tamil / Hindi localization
- [ ] 🤖 WhatsApp bot complaint submission
- [ ] 📧 Email/SMS notification gateway
- [ ] 📄 Full PDF report generation
- [ ] 🔔 Push notification support
- [ ] 🏛️ Multi-constituency admin panel

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 👨‍💻 Built With ❤️ for the Hackathon

> **People's Priorities** — Giving every citizen a direct line to governance.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://people-s-priorities.vercel.app)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange?logo=firebase)](https://firebase.google.com)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev)
