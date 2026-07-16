import type { Stage } from './types'

/**
 * Difficulty is tuned by disease stage rather than "skill level" — the
 * portal never asks a person with dementia to level up. Middle-stage
 * settings reduce item counts and choice sets and slow pacing, following
 * dementia-care UX guidance (Stirling DSDC design principles: fewer
 * decisions per screen, more time, stronger errorless support).
 */
export interface StageConfig {
  matchPairs: { pairCount: number; revealMs: number; columns: number }
  categorySort: { itemCount: number; categoryCount: number }
  routineSequence: { stepCount: number }
  orientation: { questionCount: number; choiceCount: number; hintDelayMs: number }
  faceName: { hintDelayMs: number }
  reminiscence: { promptCount: number }
  checkin: {
    wordCount: number
    attentionStart: number
    attentionStep: number
    attentionSteps: number
    clockShowsNumbers: boolean
  }
  patternRepeat: { rounds: number; minLength: number; maxLength: number; showMs: number }
  naming: { itemCount: number; choiceCount: number }
  oddOneOut: { trialCount: number }
  trivia: { questionCount: number; choiceCount: number }
  wordPuzzle: { puzzleCount: number; showCrossing: boolean }
}

export const STAGE_CONFIG: Record<Stage, StageConfig> = {
  initial: {
    matchPairs: { pairCount: 6, revealMs: 1100, columns: 4 },
    categorySort: { itemCount: 6, categoryCount: 2 },
    routineSequence: { stepCount: 4 },
    orientation: { questionCount: 4, choiceCount: 3, hintDelayMs: 6000 },
    faceName: { hintDelayMs: 5000 },
    reminiscence: { promptCount: 3 },
    checkin: { wordCount: 4, attentionStart: 20, attentionStep: 3, attentionSteps: 4, clockShowsNumbers: false },
    patternRepeat: { rounds: 4, minLength: 2, maxLength: 5, showMs: 650 },
    naming: { itemCount: 6, choiceCount: 3 },
    oddOneOut: { trialCount: 5 },
    trivia: { questionCount: 5, choiceCount: 3 },
    wordPuzzle: { puzzleCount: 3, showCrossing: true },
  },
  medium: {
    matchPairs: { pairCount: 4, revealMs: 1700, columns: 3 },
    categorySort: { itemCount: 4, categoryCount: 2 },
    routineSequence: { stepCount: 3 },
    orientation: { questionCount: 3, choiceCount: 2, hintDelayMs: 3000 },
    faceName: { hintDelayMs: 2500 },
    reminiscence: { promptCount: 2 },
    checkin: { wordCount: 3, attentionStart: 10, attentionStep: 2, attentionSteps: 3, clockShowsNumbers: true },
    patternRepeat: { rounds: 3, minLength: 2, maxLength: 3, showMs: 900 },
    naming: { itemCount: 4, choiceCount: 2 },
    oddOneOut: { trialCount: 3 },
    trivia: { questionCount: 3, choiceCount: 2 },
    wordPuzzle: { puzzleCount: 2, showCrossing: false },
  },
}
