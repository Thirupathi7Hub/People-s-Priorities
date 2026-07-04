# People's Priorities
## AI-Powered Constituency Planning Platform

A production-ready full-stack governance platform enabling citizens to report issues, track complaints, engage with their MPs (Ministers), and participate in community decision-making.

The platform is powered by **Firebase** (Auth, Firestore, Storage) and features a dynamic **Offline Demo Mode** fallback to run entirely locally if Firebase is not configured.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Thirupathi7Hub/People-s-Priorities.git
cd peoples-priorities

# Install dependencies
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

> [!NOTE]
> If these variables are missing or use default placeholders, the application automatically boots into **Offline Demo Mode** using LocalStorage so you can test all features (citizen submissions, MP dashboard views, and stats) without setting up Firebase first.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Vite + React 19 |
| **Database & Auth** | Firebase (Firestore, Authentication, Storage) |
| **Styling** | Vanilla CSS + Tailwind Utility |
| **Routing** | React Router v7 |
| **Forms & Validation** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Maps** | React Leaflet |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 👥 User Roles & Quick Demo Login

The login page features a **Quick Demo Credentials** selector. With a single click, you can log in as any of the following roles:

| Role | Access | Purpose |
|------|--------|---------|
| `citizen` | Citizen Dashboard | Submit complaints, select GPS coords, track progress, comment, and upvote issues |
| `mp` | MP / Minister Dashboard | High-level constituency planning, dynamic charts of category issues, and real-time citizen complaint tracking |
| `officer` | Officer Dashboard | Update status updates, track assignments |
| `admin` | Admin Dashboard | Full management of users, constituencies, and categories |

---

## 📁 Project Structure

```
peoples-priorities/
├── src/
│   ├── components/
│   │   ├── layouts/        # Dashboard layouts and sidebar navigation
│   │   └── ui/             # Reusable cards, badges, buttons, and skeletons
│   ├── contexts/
│   │   ├── AuthContext.jsx  # Firebase Auth listener and local user fallback
│   │   └── ThemeContext.jsx # Light/dark mode context
│   ├── firebase/
│   │   └── client.js        # Firebase SDK initialization with dynamic fallback detection
│   ├── pages/
│   │   ├── auth/            # Login, Register, Forgot Password
│   │   ├── complaints/      # List, New, and Detail complaint pages
│   │   ├── dashboards/      # Citizen, MP, Officer, Admin dashboards
│   │   └── public/          # Landing Page, About, Features, Contact
│   ├── services/
│   │   └── api.js           # Consolidated DB service mapping Firestore & LocalStorage actions
│   └── routes/
│       └── AppRouter.jsx    # Application router with Lazy-Loaded protected paths
```

---

## 🚢 Production Build & Deployment

To build the optimized production assets:
```bash
npm run build
```

The output is located in the `dist/` directory.

### Deploying to Vercel/Netlify
Ensure SPA routing redirect fallback is configured:
`netlify.toml` (Netlify SPA Redirects):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

*People's Priorities — Empowering Citizens, Enabling Governance* 🇮🇳
