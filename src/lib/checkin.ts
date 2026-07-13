import type { ObservationBand } from './types'

/** Word bank is a pool of translation keys (checkin.words.<key>); a subset is drawn per check-in. */
export const WORD_BANK_KEYS = ['garden', 'bicycle', 'umbrella', 'kitten', 'pencil', 'bridge', 'orange', 'candle']

export const CAREGIVER_QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

/** Plain-language band from a 0-1 success ratio. Never surfaced as a numeric score. */
export function bandFromRatio(ratio: number): ObservationBand {
  if (ratio >= 0.85) return 'none'
  if (ratio >= 0.5) return 'some'
  return 'considerable'
}

export function bandFromFlagCount(flagged: number, total: number): ObservationBand {
  const ratio = 1 - flagged / total
  return bandFromRatio(ratio)
}

/** Degrees clockwise from 12 o'clock, given a point's offset (dx, dy) from the clock's center (SVG y-down). */
export function pointToClockAngle(dx: number, dy: number): number {
  const rad = Math.atan2(dx, -dy)
  let deg = (rad * 180) / Math.PI
  if (deg < 0) deg += 360
  return deg
}

export function expectedNumberAngle(n: number): number {
  return (n % 12) * 30
}

export function expectedHourAngle(hour: number, minute: number): number {
  return ((hour % 12) * 30 + minute * 0.5) % 360
}

export function expectedMinuteAngle(minute: number): number {
  return (minute * 6) % 360
}

function angleDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return Math.min(diff, 360 - diff)
}

export function isNumberWellPositioned(placedAngle: number, expected: number): boolean {
  return angleDiff(placedAngle, expected) <= 20
}

export function isHourHandAccurate(placedAngle: number, hour: number, minute: number): boolean {
  return angleDiff(placedAngle, expectedHourAngle(hour, minute)) <= 20
}

export function isMinuteHandAccurate(placedAngle: number, minute: number): boolean {
  return angleDiff(placedAngle, expectedMinuteAngle(minute)) <= 15
}
