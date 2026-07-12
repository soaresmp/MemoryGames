import type { LovedOne } from './types'

/**
 * Expanding-interval schedule used by Spaced Retrieval Training (Camp, 1996;
 * widely replicated in dementia memory-rehabilitation trials). Correct,
 * unprompted recall pushes the next review further out; needing a prompt
 * resets to a short interval instead of marking a "failure" (errorless
 * learning — the person is never left on a wrong answer).
 */
const INTERVAL_DAYS = [1, 2, 4, 7, 14, 30]
const DAY_MS = 24 * 60 * 60 * 1000

export function isDue(person: LovedOne, now: number): boolean {
  return person.dueAt <= now
}

export function dueLovedOnes(people: LovedOne[], now: number): LovedOne[] {
  return people.filter((p) => isDue(p, now))
}

export function applyRecallResult(
  person: LovedOne,
  result: 'correct' | 'prompted',
  now: number,
): LovedOne {
  const nextStep =
    result === 'correct'
      ? Math.min(person.intervalStep + 1, INTERVAL_DAYS.length - 1)
      : Math.max(person.intervalStep - 1, 0)

  const days = result === 'correct' ? INTERVAL_DAYS[nextStep] : 1

  return {
    ...person,
    intervalStep: nextStep,
    dueAt: now + days * DAY_MS,
    lastResult: result,
  }
}
