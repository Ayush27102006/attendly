/**
 * timetable.js — Timetable routes
 * GET /api/timetable/:rollNumber
 */

const express   = require("express");
const router    = express.Router();
const timetable = require("../data/timetable");

/**
 * GET /api/timetable/:rollNumber
 * Returns the weekly timetable for the student.
 */
router.get("/:rollNumber", (req, res) => {
  const { rollNumber } = req.params;

  const studentTimetable = timetable[rollNumber];

  if (!studentTimetable) {
    return res.status(404).json({
      success: false,
      message: "Timetable not found for this student."
    });
  }

  return res.json({
    success: true,
    timetable: studentTimetable
  });
});

module.exports = router;
