import type { Language } from '../i18n'

export type Stage = 'initial' | 'medium'

export type ExerciseId =
  | 'orientation'
  | 'faceName'
  | 'matchPairs'
  | 'categorySort'
  | 'routineSequence'
  | 'reminiscence'
  | 'patternRepeat'
  | 'naming'
  | 'oddOneOut'
  | 'trivia'

export interface LovedOne {
  id: string
  name: string
  relationship: string
  emoji: string
  /** spaced-retrieval scheduling state */
  intervalStep: number
  dueAt: number
  lastResult?: 'correct' | 'prompted'
}

export interface SessionLogEntry {
  date: string // ISO date, day granularity
  exerciseId: ExerciseId
  /** 0-1, self-reported difficulty-adjusted success rate, not a "score" */
  success: number
  durationSec: number
}

export interface CaregiverNote {
  id: string
  text: string
  createdAt: string
}

/**
 * Cognitive Check-in — an informal, non-diagnostic observation activity
 * inspired by common clinical screening domains (clock drawing, delayed word
 * recall, attention/calculation, caregiver-reported function). It never
 * produces a numeric score or a claimed dementia "stage" — only a banded,
 * plain-language observation per domain, meant to be shared with a doctor.
 */
export type ObservationBand = 'none' | 'some' | 'considerable'

export interface ClockResult {
  numbersExpected: number
  numbersPlaced: number
  numbersWellPositioned: number
  handsAccurate: boolean
  targetHour: number
  targetMinute: number
}

export interface WordRecallResult {
  wordCount: number
  recalledCount: number
  words: string[]
}

export interface AttentionResult {
  stepsTotal: number
  stepsCorrect: number
}

export interface CaregiverQuestionnaireResult {
  answers: Record<string, 'yes' | 'no' | 'unsure'>
  flaggedCount: number
  totalCount: number
}

export interface CheckinRecord {
  id: string
  date: string // ISO date
  clock: ClockResult
  wordRecall: WordRecallResult
  attention: AttentionResult
  caregiver: CaregiverQuestionnaireResult
}

export interface PatientProfile {
  name: string
  stage: Stage
  language: Language
  fontScale: number // 1 = base, up to 1.5
  highContrast: boolean
  lovedOnes: LovedOne[]
  reminiscenceThemes: string[]
  log: SessionLogEntry[]
  streakDays: number
  lastActiveDate: string | null
  caregiverNotes: CaregiverNote[]
  checkins: CheckinRecord[]
}
