import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../components/ui'
import { useProfile } from '../lib/ProfileContext'
import type { LovedOne, Stage } from '../lib/types'
import { REMINISCENCE_PROMPTS } from '../lib/sampleData'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABEL, type Language } from '../i18n'

const ALL_THEME_KEYS = Array.from(new Set(REMINISCENCE_PROMPTS.map((p) => p.themeKey)))
const AVATAR_EMOJIS = ['👩', '👨', '👵', '👴', '🧑', '👧', '👦', '🐶', '🐱']

export default function CaregiverSettings() {
  const { profile, setProfile } = useProfile()
  const { t } = useTranslation()
  const [newName, setNewName] = useState('')
  const [newRelationship, setNewRelationship] = useState('')
  const [newEmoji, setNewEmoji] = useState(AVATAR_EMOJIS[0])

  const setStage = (stage: Stage) => setProfile((p) => ({ ...p, stage }))
  const setLanguage = (language: Language) => setProfile((p) => ({ ...p, language }))

  const addLovedOne = () => {
    if (!newName.trim()) return
    const person: LovedOne = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      relationship: newRelationship.trim() || t('relationship.family'),
      emoji: newEmoji,
      intervalStep: 0,
      dueAt: 0,
    }
    setProfile((p) => ({ ...p, lovedOnes: [...p.lovedOnes, person] }))
    setNewName('')
    setNewRelationship('')
  }

  const removeLovedOne = (id: string) => {
    setProfile((p) => ({ ...p, lovedOnes: p.lovedOnes.filter((lo) => lo.id !== id) }))
  }

  const toggleTheme = (themeKey: string) => {
    setProfile((p) => ({
      ...p,
      reminiscenceThemes: p.reminiscenceThemes.includes(themeKey)
        ? p.reminiscenceThemes.filter((k) => k !== themeKey)
        : [...p.reminiscenceThemes, themeKey],
    }))
  }

  return (
    <PageShell title={t('settings.pageTitle')}>
      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">{t('settings.patientNameLabel')}</h2>
        <input
          value={profile.name}
          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-xl border-2 border-ink/20 p-3 text-lg"
        />
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">{t('settings.languageLabel')}</h2>
        <p className="mb-3 text-base opacity-70">{t('settings.languageDesc')}</p>
        <div className="grid grid-cols-2 gap-3">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language}
              onClick={() => setLanguage(language)}
              className={`rounded-xl border-4 p-4 text-lg font-bold ${
                profile.language === language ? 'border-teal bg-teal text-white' : 'border-ink/20 bg-cream-dark'
              }`}
            >
              {LANGUAGE_LABEL[language]}
            </button>
          ))}
        </div>
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">{t('settings.stageLabel')}</h2>
        <p className="mb-3 text-base opacity-70">{t('settings.stageDesc')}</p>
        <div className="flex gap-3">
          {(['initial', 'medium'] as Stage[]).map((stage) => (
            <button
              key={stage}
              onClick={() => setStage(stage)}
              className={`flex-1 rounded-xl border-4 p-4 text-lg font-bold ${
                profile.stage === stage ? 'border-teal bg-teal text-white' : 'border-ink/20 bg-cream-dark'
              }`}
            >
              {t(`stage.${stage}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">{t('settings.accessibilityLabel')}</h2>
        <div className="mb-4">
          <label className="mb-2 block text-lg font-semibold" htmlFor="fontScale">
            {t('settings.textSizeLabel', { pct: Math.round(profile.fontScale * 100) })}
          </label>
          <input
            id="fontScale"
            type="range"
            min={1}
            max={1.5}
            step={0.1}
            value={profile.fontScale}
            onChange={(e) => setProfile((p) => ({ ...p, fontScale: Number(e.target.value) }))}
            className="w-full"
          />
        </div>
        <label className="flex items-center gap-3 text-lg font-semibold">
          <input
            type="checkbox"
            checked={profile.highContrast}
            onChange={(e) => setProfile((p) => ({ ...p, highContrast: e.target.checked }))}
            className="h-6 w-6"
          />
          {t('settings.highContrastLabel')}
        </label>
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-1 text-xl font-bold">{t('settings.facesLabel')}</h2>
        <p className="mb-4 text-base opacity-70">{t('settings.facesDesc')}</p>
        <ul className="mb-4 flex flex-col gap-2">
          {profile.lovedOnes.map((lo) => (
            <li key={lo.id} className="flex items-center justify-between gap-2 rounded-xl bg-cream-dark p-3">
              <span className="text-lg">
                <span className="mr-2 text-2xl" aria-hidden="true">
                  {lo.emoji}
                </span>
                {lo.name} — {lo.relationship}
              </span>
              <button
                onClick={() => removeLovedOne(lo.id)}
                aria-label={t('settings.removeAria', { name: lo.name })}
                className="rounded-lg px-3 py-1 text-lg font-bold text-amber-dark hover:bg-soft-amber"
              >
                {t('common.remove')}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-ink/20 p-4">
          <div className="flex gap-2">
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setNewEmoji(emoji)}
                aria-label={`Choose avatar ${emoji}`}
                className={`rounded-lg p-2 text-2xl ${newEmoji === emoji ? 'bg-soft-teal' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('settings.namePlaceholder')}
            className="rounded-xl border-2 border-ink/20 p-3 text-lg"
          />
          <input
            value={newRelationship}
            onChange={(e) => setNewRelationship(e.target.value)}
            placeholder={t('settings.relationshipPlaceholder')}
            className="rounded-xl border-2 border-ink/20 p-3 text-lg"
          />
          <button
            onClick={addLovedOne}
            className="rounded-xl bg-teal p-3 text-lg font-bold text-white hover:bg-teal-dark"
          >
            {t('settings.addButton')}
          </button>
        </div>
      </section>

      <section className="surface rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-1 text-xl font-bold">{t('settings.themesLabel')}</h2>
        <p className="mb-4 text-base opacity-70">{t('settings.themesDesc')}</p>
        <div className="flex flex-wrap gap-2">
          {ALL_THEME_KEYS.map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => toggleTheme(themeKey)}
              className={`rounded-full border-2 px-4 py-2 text-base font-semibold ${
                profile.reminiscenceThemes.includes(themeKey)
                  ? 'border-teal bg-soft-teal'
                  : 'border-ink/20 bg-cream-dark opacity-60'
              }`}
            >
              {t(`reminiscence.themes.${themeKey}`)}
            </button>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
