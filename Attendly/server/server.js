/**
 * server.js — Attendly Express Server
 * ====================================
 * Entry point for the Attendly backend.
 *
 * - Starts on Render's assigned PORT (or 5000 locally)
 * - Serves the client/ folder as static files
 * - Exposes REST API endpoints under /api/
 *
 * Run locally:
 *   node server/server.js
 *
 * Open locally:
 *   http://localhost:5000
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Use Render's PORT when deployed, otherwise use 5000 locally
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// ── Static files ─────────────────────────────────────────────────────────────

// Prefer React production build (client-react/dist) if available, otherwise fall back to original client/
const reactDistPath = path.join(__dirname, "..", "client-react", "dist");
const vanillaClientPath = path.join(__dirname, "..", "client");
const staticDir = fs.existsSync(reactDistPath) ? reactDistPath : vanillaClientPath;

app.use(express.static(staticDir));

// ── API Routes ────────────────────────────────────────────────────────────────

const authRoute = require("./routes/auth");
const studentRoute = require("./routes/student");
const attendanceRoute = require("./routes/attendance");
const timetableRoute = require("./routes/timetable");
const calendarRoute = require("./routes/calendar");

app.use("/api/auth", authRoute);
app.use("/api/student", studentRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/timetable", timetableRoute);
app.use("/api/calendar", calendarRoute);

// ── Catch-all ─────────────────────────────────────────────────────────────────

// Serve index.html for non-API routes (supports React Router client-side routing)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found."
    });
  }

  const indexPath = fs.existsSync(path.join(reactDistPath, "index.html"))
    ? path.join(reactDistPath, "index.html")
    : path.join(vanillaClientPath, "index.html");

  res.sendFile(indexPath);
});

// ── Start server ──────────────────────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Attendly — Attendance Management System");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Server running on port ${PORT}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});