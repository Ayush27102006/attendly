/**
 * attendance.js
 * Attendance records for each student.
 * Numbers are mathematically consistent: missed = held - attended.
 * Percentages are always derived from held/attended, never hardcoded separately.
 *
 * Status rules:
 *   Safe    >= 75%
 *   Warning >= 65% and < 75%
 *   Danger  < 65%
 */

/**
 * Derive status string from a percentage value.
 * @param {number} pct - Attendance percentage (0-100)
 * @returns {"Safe"|"Warning"|"Danger"}
 */
function deriveStatus(pct) {
  if (pct >= 75) return "Safe";
  if (pct >= 65) return "Warning";
  return "Danger";
}

/**
 * Build a subject attendance entry ensuring all derived fields are consistent.
 */
function makeEntry(code, name, teacher, credits, held, attended) {
  const missed = held - attended;
  const percentage = Math.round((attended / held) * 100 * 10) / 10; // One decimal
  return {
    code,
    name,
    teacher,
    credits,
    held,
    attended,
    missed,
    percentage,
    status: deriveStatus(percentage)
  };
}

// Attendance data keyed by roll number
const attendanceData = {
  "2510991399": {
    subjects: [
      //                  code        name                              teacher               cr  held  attended
      makeEntry("CSE201", "Data Structures",                     "Dr. Priya Sharma",   4,  42,   34),
      makeEntry("CSE202", "Object Oriented Programming",         "Prof. Rahul Mehta",  4,  40,   32),
      makeEntry("CSE203", "Database Management Systems",         "Dr. Anjali Singh",   3,  36,   22),  // Danger
      makeEntry("CSE204", "Computer Networks",                   "Prof. Vikram Joshi", 3,  38,   27),  // Warning
      makeEntry("CSE205", "Discrete Mathematics",                "Dr. Neha Gupta",     3,  34,   29),
      makeEntry("CSE206", "Data Structures Lab",                 "Dr. Priya Sharma",   1,  18,   16),
      makeEntry("CSE207", "OOP Lab",                             "Prof. Rahul Mehta",  1,  16,   12)  // Warning
    ]
  }
};

/**
 * Compute overall attendance stats from subject-level data.
 * @param {string} rollNumber
 * @returns {object} Summary with overallPercentage, totalHeld, totalAttended, etc.
 */
function getAttendanceSummary(rollNumber) {
  const record = attendanceData[rollNumber];
  if (!record) return null;

  const { subjects } = record;

  const totalHeld     = subjects.reduce((sum, s) => sum + s.held,     0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalMissed   = totalHeld - totalAttended;
  const overallPct    = Math.round((totalAttended / totalHeld) * 100 * 10) / 10;

  return {
    overallPercentage: overallPct,
    totalHeld,
    totalAttended,
    totalMissed,
    subjectCount: subjects.length,
    subjects
  };
}

module.exports = { attendanceData, getAttendanceSummary };
