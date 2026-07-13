import type { Language } from '../i18n'

export type Stage = 'initial' | 'medium'

export type ExerciseId =
  | 'orientation'
  | 'faceName'
  | 'matchPairs'
  | 'categorySort'
  | 'routineSequence'
  | 'reminiscence'

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
}
