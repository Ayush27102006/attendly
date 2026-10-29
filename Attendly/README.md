# Attendly — Student Attendance Management System

> **"Every class counts."**

A modern full-stack student attendance management Single Page Application (SPA) built for **FEE-II Project Evaluation-II (PE-2)**. Built with **React 19**, **Vite**, **React Router v7**, **Redux Toolkit**, **Context API**, and a **Node.js Express REST backend**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [FEE-II PE-2 University Requirements](#2-fee-ii-pe-2-university-requirements)
3. [Features](#3-features)
4. [Folder Structure](#4-folder-structure)
5. [Technologies](#5-technologies)
6. [Installation & Setup](#6-installation--setup)
7. [How to Run](#7-how-to-run)
8. [Demo Credentials](#8-demo-credentials)
9. [API Endpoints](#9-api-endpoints)
10. [Attendance & Bunk Formulas](#10-attendance--bunk-formulas)
11. [Architecture & Data Flow](#11-architecture--data-flow)
12. [University Viva Preparation & Q&A](#12-university-viva-preparation--qa)

---

## 1. Project Overview

**Attendly** is an intuitive, high-performance attendance tracking dashboard designed for university students. It empowers students to:

- Authenticate using their roll number and password.
- Monitor overall and subject-wise attendance with a dynamic SVG progress ring.
- Filter attendance records dynamically (All / Safe / Warning / Danger) with desktop table and mobile card views.
- Inspect the weekly timetable with automatic highlighting of today's weekday.
- View a color-coded monthly attendance calendar with clickable day detail breakdowns.
- Calculate bunk safety in real-time using mathematical formula solving.
- View personal student profile details retrieved via REST API.
- Access technical architecture documentation directly inside the application.

---

## 2. FEE-II PE-2 University Requirements

This project fulfills all four mandatory university components:

### Requirement 1: React Router and Navigation
- **Single Page Application (SPA)**: Zero full-page reloads across all page transitions.
- **Route Configuration (`src/App.jsx`)**: Comprehensive route tree handling public, protected, and 404 routes.
- **Shared Layout (`src/components/layout/AppLayout.jsx`)**: Shared Sidebar and dynamic Topbar wrapping pages via React Router's `<Outlet />`.
- **Navigation Indicators (`src/components/layout/Sidebar.jsx`)**: Accessible `<NavLink>` elements with active indicator styling.
- **Route Guard (`src/components/ProtectedRoute.jsx`)**: Client-side route protection checking authentication before rendering child routes.

### Requirement 2: Context API and State Architecture
- **Global Auth State (`src/context/AuthContext.jsx`)**: Manages `student`, `isAuthenticated`, `loading`, `login()`, and `logout()`.
- **Custom Hook (`useAuth`)**: Clean access to authentication state with strict provider boundary verification.
- **Graceful Lifecycle**: Initialization from `localStorage` on app startup to prevent flash redirects.
- **Separation of Concerns**: Global auth state lives in Context; async attendance data lives in Redux; localized UI state (tabs, modals, sliders) remains in component `useState`.

### Requirement 3: Redux Toolkit
- **Central Store (`src/store/store.js`)**: Configured via `configureStore` with Redux DevTools support and Immer middleware.
- **Feature Slice (`src/features/attendance/attendanceSlice.js`)**: Encapsulates attendance state, reducers, and actions.
- **Asynchronous Thunk (`createAsyncThunk`)**: `fetchAttendance` manages `pending`, `fulfilled`, and `rejected` states for API calls.
- **Selectors & Hooks**: Connected to UI via `useSelector` and `useDispatch`, including derived filtered subject selectors.

### Requirement 4: React Form Handling
- **Controlled Components (`src/components/forms/LoginForm.jsx`)**: React state drives input values and responds to `onChange`.
- **Reusable Input Hierarchy**: `Input.jsx` and `FormField.jsx` encapsulate label, accessibility attributes, and error rendering.
- **Client & Server Validation**: Validates required fields before sending HTTP requests, displaying field-level and server-returned error banners.
- **Submission Feedback**: Interactive submit buttons with loading spinners and disabled states to prevent double-submission.
- **Interactive Numeric & Range Forms (`src/pages/BunkCalculatorPage.jsx`)**: Real-time controlled number inputs and range sliders.

---

## 3. Features

| Feature | Technical Implementation |
|---|---|
| **Login Form** | Controlled React form with field validation, loading spinner, and server error handling |
| **Auth Guard** | `<ProtectedRoute>` guard checking `AuthContext.isAuthenticated` with `<Navigate>` |
| **Dashboard** | Animated SVG circular progress ring, summary statistics, and subject cards |
| **Attendance Records** | Filterable table (All / Safe / Warning / Danger) + responsive mobile card view |
| **Timetable** | Monday–Friday tabs; auto-selects current weekday on mount |
| **Calendar** | September 2026 interactive grid with day-level detail panel |
| **Bunk Calculator** | Pure formula solver; pre-filled from Redux state with interactive range slider |
| **Profile** | Student details retrieved via `GET /api/student/:rollNumber` |
| **About Documentation** | Interactive system architecture and tech stack overview |

---

## 4. Folder Structure

```
Attendly/
├── package.json                 — Root npm config (scripts for both server and client)
├── README.md                    — Project documentation
├── .gitignore                   — Git exclusions
│
├── server/                      — Node.js + Express Backend
│   ├── server.js                — Express entry point (port 5000, serves API & React dist)
│   ├── routes/
│   │   ├── auth.js              — POST /api/auth/login
│   │   ├── student.js           — GET  /api/student/:rollNumber
│   │   ├── attendance.js        — GET  /api/attendance/:rollNumber
│   │   ├── timetable.js         — GET  /api/timetable/:rollNumber
│   │   └── calendar.js          — GET  /api/calendar/:rollNumber?month=YYYY-MM
│   └── data/
│       ├── students.js          — Student records
│       ├── subjects.js          — Master course catalog
│       ├── attendance.js        — Attendance records and summary generator
│       ├── timetable.js         — Class schedule
│       └── calendar.js          — Day-by-day attendance data
│
├── client-react/                — React Frontend (Vite)
│   ├── index.html               — React HTML entry point
│   ├── vite.config.js           — Vite config with /api proxy to port 5000
│   ├── package.json             — React dependencies (React 19, Redux Toolkit, React Router)
│   └── src/
│       ├── main.jsx             — React DOM root with Redux Provider & AuthProvider
│       ├── App.jsx              — React Router route definitions
│       ├── context/
│       │   └── AuthContext.jsx  — Context API provider & useAuth hook
│       ├── store/
│       │   └── store.js         — Redux Toolkit configureStore
│       ├── features/
│       │   └── attendance/
│       │       └── attendanceSlice.js — Redux slice & createAsyncThunk
│       ├── services/
│       │   ├── api.js           — Centralized fetch() REST client
│       │   └── authUtils.js     — localStorage session utilities
│       ├── utils/
│       │   ├── helpers.js       — Formatting & date utilities
│       │   └── bunkCalculations.js — Pure formula solver
│       ├── styles/
│       │   └── style.css        — Complete design system (tokens, cards, buttons)
│       ├── components/
│       │   ├── ProtectedRoute.jsx — Route protection component
│       │   ├── forms/
│       │   │   ├── Input.jsx    — Reusable controlled input
│       │   │   ├── FormField.jsx— Reusable label + input + error wrapper
│       │   │   └── LoginForm.jsx— Login form with validation
│       │   ├── layout/
│       │   │   ├── AppLayout.jsx— Shared dashboard layout (Sidebar + Topbar + Outlet)
│       │   │   ├── Sidebar.jsx  — Navigation sidebar with active NavLinks
│       │   │   └── Topbar.jsx   — Header with dynamic titles & date
│       │   └── ui/
│       │       ├── Icons.jsx    — Inline SVG icons
│       │       ├── Spinner.jsx  — Loading spinner
│       │       ├── LoadingState.jsx — Full section loading placeholder
│       │       └── ErrorState.jsx   — Error display with retry trigger
│       └── pages/
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx
│           ├── AttendancePage.jsx
│           ├── TimetablePage.jsx
│           ├── CalendarPage.jsx
│           ├── BunkCalculatorPage.jsx
│           ├── ProfilePage.jsx
│           ├── AboutPage.jsx
│           └── NotFoundPage.jsx
│
└── client/                      — Original Vanilla JS Frontend (preserved intact)
```

---

## 5. Technologies

### Frontend
- **React 19**: Modern component architecture with hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
- **React Router v7**: Declarative client-side routing, nested routes, and route protection.
- **Redux Toolkit (RTK)**: Predictable state container with `createSlice`, `createAsyncThunk`, and typed selectors.
- **React Redux**: `useSelector` and `useDispatch` bindings.
- **React Context API**: Global authentication state and session persistence.
- **Vite 8**: Ultra-fast build tool and development server with reverse proxy.
- **CSS3 Design System**: Custom properties (tokens), CSS Grid, Flexbox, responsive design.

### Backend
- **Node.js**: Asynchronous JavaScript runtime.
- **Express.js (v4)**: REST API routes and production static file serving.
- **JavaScript Data Modules**: In-memory mock database layer in `server/data/`.

---

## 6. Installation & Setup

Ensure **Node.js (v18 or higher)** is installed on your machine.

```bash
# 1. Navigate to the project root
cd Attendly

# 2. Install backend dependencies
npm install

# 3. Install React frontend dependencies
cd client-react
npm install
cd ..
```

---

## 7. How to Run

### Development Mode (Recommended during development)
Run the backend server and frontend development server in two terminal windows:

**Terminal 1 (Backend API on port 5000):**
```bash
npm start
```

**Terminal 2 (React Vite Dev Server on port 5173):**
```bash
npm run client
# Or: cd client-react && npm run dev
```

Open your browser at:
```
http://localhost:5173
```
*Note: The Vite development server automatically proxies all `/api/*` requests to the Express server on port 5000.*

---

### Production Mode (Unified Single Server)
Build the React production bundle and serve everything from Express on port 5000:

```bash
# 1. Build the React client into client-react/dist
npm run build:client

# 2. Start the Express server
npm start
```

Open your browser at:
```
http://localhost:5000
```
Express will automatically detect `client-react/dist` and serve the production React app, with full SPA client-side routing fallback.

---

## 8. Demo Credentials

| Field | Value |
|---|---|
| **Roll Number** | `2510991399` |
| **Password** | `1234` |
| **Student Name** | Ayush Mahajan |
| **Branch** | Computer Science Engineering |
| **Semester** | 3rd Semester |

---

## 9. API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticates student credentials. Returns student profile. |
| `GET` | `/api/student/:rollNumber` | Fetches student profile (name, roll, branch, email, phone, DOB). |
| `GET` | `/api/attendance/:rollNumber` | Fetches overall attendance percentage, counts, and per-subject records. |
| `GET` | `/api/timetable/:rollNumber` | Fetches Monday through Friday period schedule. |
| `GET` | `/api/calendar/:rollNumber?month=YYYY-MM` | Fetches day-level attendance status for the month. |

---

## 10. Attendance & Bunk Formulas

### Status Thresholds
- **Safe Zone**: Attendance $\ge 75\%$
- **Warning Zone**: $65\% \le \text{Attendance} < 75\%$
- **Danger Zone**: $\text{Attendance} < 65\%$

### Bunk Prediction Formulas

**When Current Attendance $\ge$ Target (How many classes can be skipped):**
$$\text{Can Miss} = \left\lfloor \frac{\text{Attended} - (\text{Target} \times \text{Held})}{\text{Target}} \right\rfloor$$

**When Current Attendance $<$ Target (How many consecutive classes must be attended):**
$$\text{Must Attend} = \left\lceil \frac{(\text{Target} \times \text{Held}) - \text{Attended}}{1 - \text{Target}} \right\rceil$$

---

## 11. Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                              BROWSER (SPA)                              |
|                                                                         |
|   +-----------------------+                 +-----------------------+   |
|   |      AuthContext      |                 |      Redux Store      |   |
|   |  - student profile    |                 |   - attendanceSlice   |   |
|   |  - isAuthenticated    |                 |   - createAsyncThunk  |   |
|   |  - login / logout     |                 |   - status & error    |   |
|   +-----------+-----------+                 +-----------+-----------+   |
|               |                                         |               |
|               v                                         v               |
|      ProtectedRoute                            Dashboard / Attendance   |
|               |                                         |               |
|               +--------------------+--------------------+               |
|                                    |                                    |
|                                    v                                    |
|                      api.js (Centralized Client)                        |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP REST (/api/*)
                                     v
+-------------------------------------------------------------------------+
|                        EXPRESS BACKEND (:5000)                          |
|                                                                         |
|    server.js  -->  routes/auth.js, attendance.js, student.js, ...       |
|                               |                                         |
|                               v                                         |
|                     server/data/*.js (Modules)                          |
+-------------------------------------------------------------------------+
```

---

## 12. University Viva Preparation & Q&A

### Q1: Why did you migrate from Vanilla JS to React for PE-2?
> **Answer**: Vanilla JavaScript required manual DOM manipulation, manual template string injection, and full-page reloads when navigating between HTML files. React provides a declarative component model, a virtual DOM for efficient updates, and enables a true Single Page Application (SPA) architecture where state is preserved without page refreshes.

### Q2: What is the difference between Context API and Redux Toolkit in your project?
> **Answer**:
> - **Context API (`AuthContext`)** manages application-wide, low-frequency state: the logged-in student's identity and authentication status. It is lightweight and prevents prop drilling to components like `Sidebar` and `ProtectedRoute`.
> - **Redux Toolkit (`attendanceSlice`)** manages complex, asynchronous feature state: fetching attendance data with `createAsyncThunk`, handling `loading`/`succeeded`/`failed` lifecycle states, and caching data shared across multiple pages (Dashboard, Attendance, Bunk Calculator).

### Q3: How does React Router implement navigation without full-page reloads?
> **Answer**: React Router uses the HTML5 History API (`pushState`, `replaceState`, and the `popstate` event). When clicking a `<NavLink>`, the browser's URL updates without sending an HTTP request to the server. The matching route component renders inside the `<Outlet />` of `AppLayout`, avoiding white flashes and asset re-downloading.

### Q4: How did you implement protected routes?
> **Answer**: I created a `<ProtectedRoute>` component that reads `isAuthenticated` from `AuthContext`. If the student is not logged in, it renders `<Navigate to="/login" replace />`. If authenticated, it renders `<Outlet />` allowing the nested dashboard pages to display.

### Q5: What is a controlled component in your login form?
> **Answer**: A controlled component is an input element whose value is controlled by React state. In `LoginForm.jsx`, `rollNumber` and `password` values come directly from `useState`. Typing fires `onChange`, updating the React state, which then re-renders the input with the new value. This allows instant client-side validation before any network request is initiated.

### Q6: How does `createAsyncThunk` work in Redux Toolkit?
> **Answer**: `createAsyncThunk` accepts an action type string and a promise-returning callback. It automatically generates and dispatches three Redux action types:
> 1. `pending`: Dispatched when the request starts (sets `status = 'loading'`).
> 2. `fulfilled`: Dispatched when the promise resolves (sets `status = 'succeeded'` and saves payload).
> 3. `rejected`: Dispatched when the promise fails (sets `status = 'failed'` and stores error message).

### Q7: How does the application avoid CORS issues in development?
> **Answer**: In `vite.config.js`, a development server proxy is configured for `/api`. When the React app makes requests to `/api/auth/login`, the Vite dev server on port 5173 forwards them internally to the Express server on port 5000. In production, Express directly serves both the API and the static files, maintaining single-origin communication.

---

*Attendly — Built for CSE 3rd Semester · FEE-II PE-2 Academic Session 2023-24*
