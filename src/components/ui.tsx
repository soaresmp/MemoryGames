import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

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
  return (
    <Link
      to="/"
      className="surface inline-flex items-center gap-2 rounded-xl border-2 border-ink/20 bg-white/70 px-5 py-3 text-xl font-semibold text-ink shadow-sm hover:bg-white"
    >
      <span aria-hidden="true">🏠</span> Home
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
  if (!state) return null
  if (state === 'correct') {
    return (
      <p className="mt-4 rounded-xl bg-soft-teal p-4 text-2xl font-bold text-teal-dark" role="status">
        ✅ That's right, well done!
      </p>
    )
  }
  return (
    <p className="mt-4 rounded-xl bg-soft-amber p-4 text-2xl font-bold text-amber-dark" role="status">
      💡 Here's a little help.
    </p>
  )
}
