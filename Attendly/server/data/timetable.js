/**
 * timetable.js
 * Weekly timetable for 3rd Semester CSE students.
 * Each day lists periods in chronological order.
 * type: "class" | "break" | "lunch"
 */

const timetable = {
  "2510991399": {
    Monday: [
      { start: "09:00", end: "09:50", type: "class",  subject: "Data Structures",             code: "CSE201", teacher: "Dr. Priya Sharma",   room: "A-301" },
      { start: "09:50", end: "10:40", type: "class",  subject: "Object Oriented Programming", code: "CSE202", teacher: "Prof. Rahul Mehta",  room: "A-301" },
      { start: "10:40", end: "10:55", type: "break",  label: "Short Break" },
      { start: "10:55", end: "11:45", type: "class",  subject: "Discrete Mathematics",        code: "CSE205", teacher: "Dr. Neha Gupta",     room: "A-301" },
      { start: "11:45", end: "12:35", type: "class",  subject: "Computer Networks",           code: "CSE204", teacher: "Prof. Vikram Joshi", room: "A-301" },
      { start: "12:35", end: "13:20", type: "lunch",  label: "Lunch Break" },
      { start: "13:20", end: "15:20", type: "class",  subject: "Data Structures Lab",         code: "CSE206", teacher: "Dr. Priya Sharma",   room: "Lab-1" }
    ],
    Tuesday: [
      { start: "09:00", end: "09:50", type: "class",  subject: "Object Oriented Programming", code: "CSE202", teacher: "Prof. Rahul Mehta",  room: "A-302" },
      { start: "09:50", end: "10:40", type: "class",  subject: "Database Management Systems", code: "CSE203", teacher: "Dr. Anjali Singh",   room: "A-302" },
      { start: "10:40", end: "10:55", type: "break",  label: "Short Break" },
      { start: "10:55", end: "11:45", type: "class",  subject: "Computer Networks",           code: "CSE204", teacher: "Prof. Vikram Joshi", room: "A-302" },
      { start: "11:45", end: "12:35", type: "class",  subject: "Data Structures",             code: "CSE201", teacher: "Dr. Priya Sharma",   room: "A-302" },
      { start: "12:35", end: "13:20", type: "lunch",  label: "Lunch Break" },
      { start: "13:20", end: "15:20", type: "class",  subject: "OOP Lab",                     code: "CSE207", teacher: "Prof. Rahul Mehta",  room: "Lab-2" }
    ],
    Wednesday: [
      { start: "09:00", end: "09:50", type: "class",  subject: "Discrete Mathematics",        code: "CSE205", teacher: "Dr. Neha Gupta",     room: "A-303" },
      { start: "09:50", end: "10:40", type: "class",  subject: "Data Structures",             code: "CSE201", teacher: "Dr. Priya Sharma",   room: "A-303" },
      { start: "10:40", end: "10:55", type: "break",  label: "Short Break" },
      { start: "10:55", end: "11:45", type: "class",  subject: "Database Management Systems", code: "CSE203", teacher: "Dr. Anjali Singh",   room: "A-303" },
      { start: "11:45", end: "12:35", type: "class",  subject: "Object Oriented Programming", code: "CSE202", teacher: "Prof. Rahul Mehta",  room: "A-303" },
      { start: "12:35", end: "13:20", type: "lunch",  label: "Lunch Break" },
      { start: "13:20", end: "14:10", type: "class",  subject: "Computer Networks",           code: "CSE204", teacher: "Prof. Vikram Joshi", room: "A-303" }
    ],
    Thursday: [
      { start: "09:00", end: "09:50", type: "class",  subject: "Database Management Systems", code: "CSE203", teacher: "Dr. Anjali Singh",   room: "A-304" },
      { start: "09:50", end: "10:40", type: "class",  subject: "Computer Networks",           code: "CSE204", teacher: "Prof. Vikram Joshi", room: "A-304" },
      { start: "10:40", end: "10:55", type: "break",  label: "Short Break" },
      { start: "10:55", end: "11:45", type: "class",  subject: "Data Structures",             code: "CSE201", teacher: "Dr. Priya Sharma",   room: "A-304" },
      { start: "11:45", end: "12:35", type: "class",  subject: "Discrete Mathematics",        code: "CSE205", teacher: "Dr. Neha Gupta",     room: "A-304" },
      { start: "12:35", end: "13:20", type: "lunch",  label: "Lunch Break" },
      { start: "13:20", end: "14:10", type: "class",  subject: "Object Oriented Programming", code: "CSE202", teacher: "Prof. Rahul Mehta",  room: "A-304" }
    ],
    Friday: [
      { start: "09:00", end: "09:50", type: "class",  subject: "Computer Networks",           code: "CSE204", teacher: "Prof. Vikram Joshi", room: "A-305" },
      { start: "09:50", end: "10:40", type: "class",  subject: "Discrete Mathematics",        code: "CSE205", teacher: "Dr. Neha Gupta",     room: "A-305" },
      { start: "10:40", end: "10:55", type: "break",  label: "Short Break" },
      { start: "10:55", end: "11:45", type: "class",  subject: "Database Management Systems", code: "CSE203", teacher: "Dr. Anjali Singh",   room: "A-305" },
      { start: "11:45", end: "12:35", type: "class",  subject: "Data Structures",             code: "CSE201", teacher: "Dr. Priya Sharma",   room: "A-305" },
      { start: "12:35", end: "13:20", type: "lunch",  label: "Lunch Break" },
      { start: "13:20", end: "14:10", type: "class",  subject: "Object Oriented Programming", code: "CSE202", teacher: "Prof. Rahul Mehta",  room: "A-305" }
    ]
  }
};

module.exports = timetable;
