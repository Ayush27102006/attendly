/**
 * bunkCalculations.js — Pure attendance formula functions
 * =========================================================
 * Extracted from client/js/bunk-calculator.js.
 * These are pure math functions — no DOM, no React, no side effects.
 * The same formulas that exist in your original project.
 *
 * Viva question: "How does the bunk calculator formula work?"
 *
 * If ABOVE target (can miss):
 *   Solve: attended / (held + x) >= target  for x
 *   → x = floor( (attended − target × held) / target )
 *
 * If BELOW target (must attend):
 *   Solve: (attended + x) / (held + x) >= target  for x
 *   → x = ceil( (target × held − attended) / (1 − target) )
 */

/**
 * @typedef {"above"|"below"|"at-target"|"empty"|"invalid"|"negative"|"impossible"} CalcMode
 */

/**
 * @typedef {object} CalcResult
 * @property {CalcMode} mode
 * @property {number|null} value      - canMiss or mustAttend count
 * @property {number} currentPct      - 0–100
 * @property {number} targetPct       - 0–100
 */

/**
 * Run the bunk calculator logic.
 * @param {number} held
 * @param {number} attended
 * @param {number} targetPct - Target percentage 0–100 (e.g. 75)
 * @returns {CalcResult}
 */
export function calculateBunk(held, attended, targetPct) {
  const target = targetPct / 100;

  if (held === 0) {
    return { mode: 'empty', value: null, currentPct: 0, targetPct };
  }

  if (attended > held) {
    return { mode: 'invalid', value: null, currentPct: 0, targetPct };
  }

  if (attended < 0 || held < 0) {
    return { mode: 'negative', value: null, currentPct: 0, targetPct };
  }

  const currentFraction = attended / held;
  const currentPct = currentFraction * 100;

  // Edge case: target is 100%
  if (target === 1.0) {
    if (currentFraction === 1.0) {
      return { mode: 'at-target', value: 0, currentPct, targetPct };
    }
    return { mode: 'impossible', value: null, currentPct, targetPct };
  }

  if (currentFraction >= target) {
    const canMiss = Math.floor((attended - target * held) / target);
    if (canMiss === 0 && currentFraction === target) {
      return { mode: 'at-target', value: 0, currentPct, targetPct };
    }
    return { mode: 'above', value: canMiss, currentPct, targetPct };
  }

  const mustAttend = Math.ceil((target * held - attended) / (1 - target));
  return { mode: 'below', value: mustAttend, currentPct, targetPct };
}

