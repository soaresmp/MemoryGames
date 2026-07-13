import type { ExerciseId, PatientProfile } from './types'
import i18n, { detectSupportedLanguage } from '../i18n'

const STORAGE_KEY = 'mindtrail.profile.v1'

function defaultProfile(): PatientProfile {
  const now = 0 // dueAt=0 means "due immediately" for a fresh profile
  const language = detectSupportedLanguage()
  const t = i18n.getFixedT(language)
  return {
    name: t('common.defaultPatientName'),
    stage: 'initial',
    language,
    fontScale: 1,
    highContrast: false,
    lovedOnes: [
      { id: 'lo1', name: 'Anna', relationship: t('relationship.daughter'), emoji: '👩', intervalStep: 0, dueAt: now },
      { id: 'lo2', name: 'Tom', relationship: t('relationship.son'), emoji: '👨', intervalStep: 0, dueAt: now },
      { id: 'lo3', name: 'Biscuit', relationship: t('relationship.dog'), emoji: '🐶', intervalStep: 0, dueAt: now },
    ],
    // keys into reminiscence.themes / reminiscence.prompts, not display text
    reminiscenceThemes: ['music60s', 'childhoodGames', 'familyHolidays', 'oldRecipes'],
    log: [],
    streakDays: 0,
    lastActiveDate: null,
    caregiverNotes: [],
    checkins: [],
  }
}

export function saveCheckin(profile: PatientProfile, record: PatientProfile['checkins'][number]): PatientProfile {
  return { ...profile, checkins: [...profile.checkins, record].slice(-50) }
}

export function loadProfile(): PatientProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProfile()
    const parsed = JSON.parse(raw) as PatientProfile
    // guard against schema drift between prototype iterations
    return { ...defaultProfile(), ...parsed }
  } catch {
    return defaultProfile()
  }
}

export function saveProfile(profile: PatientProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function recordSession(
  profile: PatientProfile,
  exerciseId: ExerciseId,
  success: number,
  durationSec: number,
): PatientProfile {
  const today = todayISO()
  let streakDays = profile.streakDays
  if (profile.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    streakDays = profile.lastActiveDate === yesterday ? streakDays + 1 : 1
  }

  return {
    ...profile,
    lastActiveDate: today,
    streakDays,
    log: [...profile.log, { date: today, exerciseId, success, durationSec }].slice(-200),
  }
}
