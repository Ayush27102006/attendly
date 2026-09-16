/**
 * calendar.js — Attendance calendar routes
 * GET /api/calendar/:rollNumber?month=YYYY-MM
 * Returns day-level attendance status for the given month.
 */

const express      = require("express");
const router       = express.Router();
const calendarData = require("../data/calendar");

/**
 * GET /api/calendar/:rollNumber
 * Query param: month=YYYY-MM  (defaults to current month if omitted)
 */
router.get("/:rollNumber", (req, res) => {
  const { rollNumber } = req.params;
  const { month }      = req.query;

  const studentData = calendarData[rollNumber];

  if (!studentData) {
    return res.status(404).json({
      success: false,
      message: "Calendar data not found for this student."
    });
  }

  // Default to current month if none provided
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  const monthData = studentData[targetMonth];

  if (!monthData) {
    return res.status(404).json({
      success: false,
      message: `No calendar data available for ${targetMonth}.`
    });
  }

  return res.json({
    success: true,
    month:   targetMonth,
    days:    monthData
  });
});

module.exports = router;
