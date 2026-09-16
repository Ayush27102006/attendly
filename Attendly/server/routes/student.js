/**
 * student.js — Student profile routes
 * GET /api/student/:rollNumber
 */

const express  = require("express");
const router   = express.Router();
const students = require("../data/students");

/**
 * GET /api/student/:rollNumber
 * Returns public profile data for the given roll number.
 */
router.get("/:rollNumber", (req, res) => {
  const { rollNumber } = req.params;

  const student = students.find(s => s.rollNumber === rollNumber);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found."
    });
  }

  // Return safe profile (no password)
  return res.json({
    success: true,
    student: {
      name:       student.name,
      rollNumber: student.rollNumber,
      branch:     student.branch,
      semester:   student.semester,
      session:    student.session,
      email:      student.email,
      phone:      student.phone,
      dob:        student.dob,
      section:    student.section
    }
  });
});

module.exports = router;
