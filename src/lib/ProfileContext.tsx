import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ExerciseId, PatientProfile } from './types'
import { loadProfile, recordSession, saveProfile } from './storage'
import i18n from '../i18n'

interface ProfileContextValue {
  profile: PatientProfile
  setProfile: (updater: (p: PatientProfile) => PatientProfile) => void
  logSession: (exerciseId: ExerciseId, success: number, durationSec: number) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<PatientProfile>(() => loadProfile())

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  useEffect(() => {
    document.documentElement.style.fontSize = `${100 * profile.fontScale}%`
    document.documentElement.classList.toggle('high-contrast', profile.highContrast)
  }, [profile.fontScale, profile.highContrast])

  useEffect(() => {
    document.documentElement.lang = profile.language
    if (i18n.language !== profile.language) {
      i18n.changeLanguage(profile.language)
    }
  }, [profile.language])

  const setProfile = (updater: (p: PatientProfile) => PatientProfile) => {
    setProfileState((prev) => updater(prev))
  }

  const logSession = (exerciseId: ExerciseId, success: number, durationSec: number) => {
    setProfileState((prev) => recordSession(prev, exerciseId, success, durationSec))
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile, logSession }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
