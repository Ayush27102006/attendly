/**
 * attendance.js — Attendance routes
 * GET /api/attendance/:rollNumber
 */

const express = require("express");
const router  = express.Router();
const { getAttendanceSummary } = require("../data/attendance");

/**
 * GET /api/attendance/:rollNumber
 * Returns overall summary and per-subject attendance.
 */
router.get("/:rollNumber", (req, res) => {
  const { rollNumber } = req.params;

  const summary = getAttendanceSummary(rollNumber);

  if (!summary) {
    return res.status(404).json({
      success: false,
      message: "Attendance data not found for this student."
    });
  }

  return res.json({
    success: true,
    ...summary
  });
});

module.exports = router;
