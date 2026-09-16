# Attendly — Student Attendance Management System

> **"Every class counts."**

A complete, full-stack college project built with Vanilla JavaScript, Node.js, and Express — no React, no database, no CSS frameworks.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Folder Structure](#3-folder-structure)
4. [Technologies](#4-technologies)
5. [Installation](#5-installation)
6. [How to Run](#6-how-to-run)
7. [Demo Credentials](#7-demo-credentials)
8. [API Endpoints](#8-api-endpoints)
9. [Attendance Formulas](#9-attendance-formulas)
10. [Architecture](#10-architecture)
11. [Limitations](#11-limitations)
12. [Viva Explanation](#12-viva-explanation)

---

## 1. Project Overview

**Attendly** is a student attendance management dashboard that allows a student to:

- Log in using their roll number and password
- View overall and subject-wise attendance with a live progress ring
- Filter attendance records by status (Safe / Warning / Danger)
- View the weekly timetable (auto-selects today's weekday)
- Browse a full monthly calendar with colour-coded attendance
- Use an interactive bunk calculator to determine how many classes can be skipped or must be attended
- Read an architecture explanation suitable for a college viva

---

## 2. Features

| Feature | Details |
|---|---|
| **Login** | Roll number + password authenticated via Express backend |
| **Auth Guard** | Every page calls `requireAuth()` — redirects to login if not authenticated |
| **Dashboard** | SVG circular ring, summary cards, subject attendance cards |
| **Attendance** | Filterable table (All / Safe / Warning / Danger) + mobile card view |
| **Timetable** | Mon–Fri tabs with class, break, and lunch period cards |
| **Calendar** | Full September 2026 grid with clickable day detail panel |
| **Bunk Calculator** | Real-time calculations with slider, presets, and formula display |
| **About** | Visual architecture diagram, feature list, and tech stack |
| **Responsive** | Works on desktop, tablet, and mobile |
| **No framework** | Pure HTML / CSS / Vanilla JS + Node.js + Express |

---

## 3. Folder Structure

```
Attendly/
│
├── package.json            — npm config, start script
├── README.md               — This file
│
├── server/
│   ├── server.js           — Express entry point (port 5000)
│   │
│   ├── routes/
│   │   ├── auth.js         — POST /api/auth/login
│   │   ├── student.js      — GET  /api/student/:rollNumber
│   │   ├── attendance.js   — GET  /api/attendance/:rollNumber
│   │   ├── timetable.js    — GET  /api/timetable/:rollNumber
│   │   └── calendar.js     — GET  /api/calendar/:rollNumber?month=YYYY-MM
│   │
│   └── data/
│       ├── students.js     — Student records
│       ├── subjects.js     — Subject master list
│       ├── attendance.js   — Attendance figures + helper functions
│       ├── timetable.js    — Weekly schedule
│       └── calendar.js     — Monthly calendar data (September 2026)
│
└── client/
    ├── index.html          — Login page
    │
    ├── pages/
    │   ├── dashboard.html
    │   ├── attendance.html
    │   ├── timetable.html
    │   ├── calendar.html
    │   ├── bunk-calculator.html
    │   └── about.html
    │
    ├── css/
    │   └── style.css       — Full design system (single file)
    │
    └── js/
        ├── api.js          — All fetch() API functions
        ├── auth.js         — Session management + requireAuth()
        ├── layout.js       — Sidebar, topbar, shared utilities
        ├── dashboard.js    — Dashboard page logic
        ├── attendance.js   — Attendance records page logic
        ├── timetable.js    — Timetable page logic
        ├── calendar.js     — Calendar page logic
        └── bunk-calculator.js — Bunk calculator logic
```

---

## 4. Technologies

### Frontend
- **HTML5** — Semantic markup
- **CSS3** — Grid, Flexbox, custom properties (design tokens), media queries
- **Vanilla JavaScript (ES6+)** — async/await, fetch(), localStorage, DOM manipulation
- **SVG** — Circular progress ring, inline icons

### Backend
- **Node.js (v18+)**
- **Express.js (v4)**
- **JavaScript modules** in `server/data/` as the data source

### Not used
- React, Vue, Angular, Next.js, Vite
- Bootstrap, Tailwind, jQuery
- MongoDB, MySQL, SQLite, Firebase

---

## 5. Installation

Make sure **Node.js (v18 or later)** is installed.

```bash
# Clone or extract the project
cd Attendly

# Install dependencies (only express)
npm install
```

---

## 6. How to Run

```bash
npm start
```

Then open your browser and go to:

```
http://localhost:5000
```

The Express server:
1. Starts on port 5000
2. Serves the `client/` folder as static files
3. Exposes REST API endpoints under `/api/`

---

## 7. Demo Credentials

| Field | Value |
|---|---|
| **Roll Number** | `2510991399` |
| **Password** | `1234` |
| **Name** | Ayush Mahajan |
| **Branch** | Computer Science Engineering |
| **Semester** | 3rd Semester |

These are visible on the login page as a hint card.

---

## 8. API Endpoints

### POST `/api/auth/login`

```json
// Request body
{ "rollNumber": "2510991399", "password": "1234" }

// Success response
{ "success": true, "student": { "name": "...", "rollNumber": "...", ... } }

// Failure response
{ "success": false, "message": "Invalid roll number or password." }
```

### GET `/api/student/:rollNumber`

Returns student profile (no password).

### GET `/api/attendance/:rollNumber`

Returns:
- `overallPercentage` — calculated from total attended/held
- `totalHeld`, `totalAttended`, `totalMissed`
- `subjectCount`
- `subjects[]` — array with per-subject breakdown

### GET `/api/timetable/:rollNumber`

Returns `timetable` object with keys `Monday`–`Friday`, each an array of periods.

### GET `/api/calendar/:rollNumber?month=YYYY-MM`

Returns `days[]` for the requested month (only `2026-09` is populated).

Each day has `date`, `status`, and `classes[]`.

---

## 9. Attendance Formulas

### Status thresholds

| Status | Condition |
|---|---|
| Safe | `percentage >= 75%` |
| Warning | `65% <= percentage < 75%` |
| Danger | `percentage < 65%` |

### Bunk Calculator — Can Miss

When current attendance ≥ target:

```
x = floor( (attended − target × held) ÷ target )
```

Solve: `attended ÷ (held + x) ≥ target`

### Bunk Calculator — Must Attend

When current attendance < target:

```
x = ceil( (target × held − attended) ÷ (1 − target) )
```

Solve: `(attended + x) ÷ (held + x) ≥ target`

---

## 10. Architecture

```
         Student
            ↓  (opens browser)
      Browser / UI
            ↓  (HTML/CSS/JS served from Express)
  Vanilla HTML + CSS + JS
            ↓  (fetch() with async/await)
    Express REST API (/api/*)
            ↓  (require() at startup)
     JavaScript Data Modules
       (server/data/*.js)
```

**Key design decisions:**

- Express serves both the frontend (static) and API calls (same origin → no CORS needed)
- `localStorage` stores the session — password is never stored
- All percentages are derived from `attended / held` — never hardcoded
- A single `style.css` file keeps the design system in one place
- `api.js` centralises all fetch logic — pages never write their own fetch calls

---

## 11. Limitations

> This is a college demonstration project — not production-ready.

- **Passwords are stored in plain text** in `server/data/students.js` — never do this in production
- **No real session tokens** — localStorage auth flag can be bypassed by a knowledgeable user
- **No HTTPS** — run locally only
- **Single student** — only `2510991399` is in the data
- **Calendar** — only September 2026 data is available
- **No persistent storage** — all data resets on server restart

---

## 12. Viva Explanation

**Q: What is Attendly?**
> A student attendance management dashboard that lets a student log in, see their subject-wise attendance, weekly timetable, monthly calendar, and use a bunk calculator.

**Q: What technologies did you use?**
> Frontend: pure HTML, CSS3, and Vanilla JavaScript. Backend: Node.js with Express. Data: JavaScript modules — no external database.

**Q: Why no React or database?**
> To demonstrate understanding of core concepts without hiding them behind abstractions. Every fetch, every DOM update, and every calculation is written by hand.

**Q: How does login work?**
> The browser sends credentials to `POST /api/auth/login`. Express looks up the student in `students.js`. On success, it returns the student object (never the password). The browser stores this in `localStorage` and redirects.

**Q: How is the bunk formula derived?**
> If above target: solve `attended ÷ (held + x) ≥ target` for x → `x = floor((attended − target×held) ÷ target)`. If below target: solve `(attended + x) ÷ (held + x) ≥ target` for x → `x = ceil((target×held − attended) ÷ (1 − target))`.

**Q: How is the circular progress ring drawn?**
> Using an SVG `<circle>` with `stroke-dasharray` and `stroke-dashoffset`. By setting dashoffset to `circumference × (1 − percentage/100)`, the stroke fills exactly proportional to the attendance.

**Q: How does the auth guard work?**
> Every protected page calls `requireAuth()` from `auth.js`. That function checks `localStorage` for the auth flag. If missing, it calls `window.location.replace("/index.html")` immediately.

---

*Attendly — Built for CSE 3rd Semester, Academic Session 2023-24*
