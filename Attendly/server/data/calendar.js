/**
 * calendar.js
 * Attendance calendar data for September 2026.
 * September 1, 2026 is a Tuesday.
 * Weekends = Saturday (index 5) and Sunday (index 6).
 *
 * status: "present" | "absent" | "holiday" | "weekend"
 */

// Subjects taught each weekday (matches the timetable pattern)
const dailySubjects = {
  Monday:    ["CSE201", "CSE202", "CSE205", "CSE204", "CSE206"],
  Tuesday:   ["CSE202", "CSE203", "CSE204", "CSE201", "CSE207"],
  Wednesday: ["CSE205", "CSE201", "CSE203", "CSE202", "CSE204"],
  Thursday:  ["CSE203", "CSE204", "CSE201", "CSE205", "CSE202"],
  Friday:    ["CSE204", "CSE205", "CSE203", "CSE201", "CSE202"]
};

const subjectNames = {
  CSE201: "Data Structures",
  CSE202: "Object Oriented Programming",
  CSE203: "Database Management Systems",
  CSE204: "Computer Networks",
  CSE205: "Discrete Mathematics",
  CSE206: "Data Structures Lab",
  CSE207: "OOP Lab"
};

// September 2026 calendar (1st is Tuesday)
// Day-of-week: 0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun
const dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/**
 * Build attendance detail for a single class period.
 * We define specific absent dates for realistic data.
 */
const absentDates = ["2026-09-03", "2026-09-10", "2026-09-17", "2026-09-18", "2026-09-25"];
const partialAbsentDates = {
  // date -> array of subject codes where the student was absent
  "2026-09-08": ["CSE203"],
  "2026-09-11": ["CSE204", "CSE203"],
  "2026-09-15": ["CSE204"],
  "2026-09-22": ["CSE203"],
  "2026-09-24": ["CSE203", "CSE205"]
};
const holidays = ["2026-09-05"]; // National Teacher's Day (example)

/**
 * Generate the full September 2026 calendar data for a student.
 * @returns {Array} Array of day objects
 */
function generateSeptemberCalendar() {
  const days = [];

  // Sep 1 2026 is a Tuesday — JavaScript Date: getDay() 2
  for (let d = 1; d <= 30; d++) {
    const dateStr = `2026-09-${String(d).padStart(2, "0")}`;
    const jsDate  = new Date(dateStr);
    const jsDay   = jsDate.getDay(); // 0=Sun,1=Mon,...,6=Sat

    // Map JS day to our Mon-first index
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1; // 0=Mon,...,6=Sun
    const dayName  = dayNames[dayIndex];

    // Weekend
    if (dayIndex === 5 || dayIndex === 6) {
      days.push({ date: dateStr, status: "weekend", classes: [] });
      continue;
    }

    // Holiday
    if (holidays.includes(dateStr)) {
      days.push({ date: dateStr, status: "holiday", dayName, classes: [] });
      continue;
    }

    // Full absent day
    if (absentDates.includes(dateStr)) {
      const subjects = (dailySubjects[dayName] || []).map(code => ({
        subjectCode: code,
        subject: subjectNames[code],
        status: "absent"
      }));
      days.push({ date: dateStr, status: "absent", dayName, classes: subjects });
      continue;
    }

    // Partial or full present day
    const partialAbsent = partialAbsentDates[dateStr] || [];
    const subjects = (dailySubjects[dayName] || []).map(code => ({
      subjectCode: code,
      subject: subjectNames[code],
      status: partialAbsent.includes(code) ? "absent" : "present"
    }));

    // If any class was absent, mark day as partially absent (still show as "present" with individual marks)
    const dayStatus = partialAbsent.length > 0 ? "partial" : "present";
    days.push({ date: dateStr, status: dayStatus, dayName, classes: subjects });
  }

  return days;
}

const calendarData = {
  "2510991399": {
    "2026-09": generateSeptemberCalendar()
  }
};

module.exports = calendarData;
