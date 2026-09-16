/**
 * students.js
 * Sample student data for Attendly.
 * In production this would be replaced by a real database.
 * Passwords should be hashed — kept plain here for demo purposes only.
 */

const students = [
  {
    rollNumber: "2510991399",
    password: "1234",             // Plain text — demo only, NOT production practice
    name: "Ayush Mahajan",
    branch: "Computer Science Engineering",
    semester: "3rd Semester",
    session: "2023-24",
    email: "ayush.mahajan@college.edu",
    phone: "+91 98765 43210",
    dob: "2005-08-15",
    section: "A"
  }
];

module.exports = students;
