/**
 * auth.js — Authentication routes
 * POST /api/auth/login
 * Validates roll number and password against the student data module.
 */

const express = require("express");
const router  = express.Router();
const students = require("../data/students");

/**
 * POST /api/auth/login
 * Body: { rollNumber: string, password: string }
 * Returns student info on success, error message on failure.
 * NOTE: Password comparison is plain text — demo project only.
 */
router.post("/login", (req, res) => {
  const { rollNumber, password } = req.body;

  // Basic input validation
  if (!rollNumber || !password) {
    return res.status(400).json({
      success: false,
      message: "Roll number and password are required."
    });
  }

  // Find student by roll number
  const student = students.find(s => s.rollNumber === String(rollNumber).trim());

  if (!student) {
    return res.status(401).json({
      success: false,
      message: "Invalid roll number or password."
    });
  }

  // Compare password (plain text — demo only)
  if (student.password !== String(password)) {
    return res.status(401).json({
      success: false,
      message: "Invalid roll number or password."
    });
  }

  // Authentication successful — return safe subset of student data
  // Never include the password in the response
  return res.json({
    success: true,
    student: {
      name:       student.name,
      rollNumber: student.rollNumber,
      branch:     student.branch,
      semester:   student.semester,
      session:    student.session,
      section:    student.section
    }
  });
});

module.exports = router;
