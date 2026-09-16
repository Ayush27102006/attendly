/**
 * server.js — Attendly Express Server
 * ====================================
 * Entry point for the Attendly backend.
 * - Starts on port 5000
 * - Serves the client/ folder as static files
 * - Exposes REST API endpoints under /api/
 *
 * Run:  node server/server.js
 * Open: http://localhost:5000
 */

const express = require("express");
const path    = require("path");

const app  = express();
const PORT = 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

// Parse incoming JSON bodies (for POST /api/auth/login)
app.use(express.json());

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: false }));

// ── Static files ──────────────────────────────────────────────────────────────
// Serve everything inside client/ at the root URL
app.use(express.static(path.join(__dirname, "..", "client")));

// ── API Routes ────────────────────────────────────────────────────────────────
const authRoute       = require("./routes/auth");
const studentRoute    = require("./routes/student");
const attendanceRoute = require("./routes/attendance");
const timetableRoute  = require("./routes/timetable");
const calendarRoute   = require("./routes/calendar");

app.use("/api/auth",       authRoute);
app.use("/api/student",    studentRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/timetable",  timetableRoute);
app.use("/api/calendar",   calendarRoute);

// ── Catch-all: serve index.html for any non-API, non-static request ───────────
// This allows direct navigation to /pages/dashboard.html etc.
app.get("*", (req, res) => {
  // Only handle non-API routes here
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API endpoint not found." });
  }
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Attendly — Attendance Management System");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Server running at http://localhost:${PORT}`);
  console.log("  Demo: Roll# 2510991399 | Pass: 1234");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
