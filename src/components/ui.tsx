import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, LANGUAGE_FLAG, LANGUAGE_LABEL } from '../i18n'
import { useProfile } from '../lib/ProfileContext'

/**
 * Always-visible, one-tap language row — deliberately icon-first (flag + native
 * name) so it's discoverable without being able to read the app's current
 * language. Lives at the very top of Home so it's the first thing anyone sees.
 */
export function LanguageSwitcher() {
  const { profile, setProfile } = useProfile()
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Language">
      {SUPPORTED_LANGUAGES.map((language) => (
        <button
          key={language}
          onClick={() => setProfile((p) => ({ ...p, language }))}
          className={`flex items-center gap-1 rounded-full border-2 px-3 py-2 text-base font-semibold transition-colors ${
            profile.language === language ? 'border-teal bg-teal text-white' : 'border-ink/20 bg-white/70 hover:bg-white'
          }`}
        >
          <span className="text-xl" aria-hidden="true">
            {LANGUAGE_FLAG[language]}
          </span>
          {LANGUAGE_LABEL[language]}
        </button>
      ))}
    </div>
  )
}

/** Large, high-contrast tappable card — the only interaction unit patient screens use. */
export function BigButton({
  to,
  onClick,
  emoji,
  label,
  sublabel,
  tone = 'amber',
}: {
  to?: string
  onClick?: () => void
  emoji: string
  label: string
  sublabel?: string
  tone?: 'amber' | 'teal'
}) {
  const toneClasses =
    tone === 'amber'
      ? 'bg-soft-amber border-amber hover:bg-amber hover:text-white'
      : 'bg-soft-teal border-teal hover:bg-teal hover:text-white'

  const content = (
    <div
      className={`surface group flex min-h-28 w-full items-center gap-4 rounded-2xl border-4 p-5 text-left transition-colors ${toneClasses}`}
    >
      <span className="text-5xl leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span className="flex flex-col">
        <span className="text-2xl font-bold">{label}</span>
        {sublabel && <span className="text-lg opacity-80">{sublabel}</span>}
      </span>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className="block w-full">
      {content}
    </button>
  )
}

export function HomeLink() {
  const { t } = useTranslation()
  return (
    <Link
      to="/"
      className="surface inline-flex items-center gap-2 rounded-xl border-2 border-ink/20 bg-white/70 px-5 py-3 text-xl font-semibold text-ink shadow-sm hover:bg-white"
    >
      <span aria-hidden="true">🏠</span> {t('common.home')}
    </Link>
  )
}

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-5 py-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <HomeLink />
      </div>
      <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {children}
    </div>
  )
}

/** Gentle, non-judgmental feedback — errorless-learning UI never shows a hard "wrong" mark. */
export function GentleFeedback({ state }: { state: 'correct' | 'hint' | null }) {
  const { t } = useTranslation()
  if (!state) return null
  if (state === 'correct') {
    return (
      <p className="mt-4 rounded-xl bg-soft-teal p-4 text-2xl font-bold text-teal-dark" role="status">
        ✅ {t('common.feedbackCorrect')}
      </p>
    )
  }
  return (
    <p className="mt-4 rounded-xl bg-soft-amber p-4 text-2xl font-bold text-amber-dark" role="status">
      💡 {t('common.feedbackHint')}
    </p>
  )
}
