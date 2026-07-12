import { useState } from 'react'
import { PageShell } from '../components/ui'
import SessionComplete from '../components/SessionComplete'
import { useProfile } from '../lib/ProfileContext'
import { STAGE_CONFIG } from '../lib/difficulty'
import { REMINISCENCE_PROMPTS } from '../lib/sampleData'
import { shuffle } from '../lib/util'

export default function Reminiscence() {
  const { profile, logSession } = useProfile()
  const cfg = STAGE_CONFIG[profile.stage].reminiscence

  const [prompts] = useState(() => {
    const active = REMINISCENCE_PROMPTS.filter((p) => profile.reminiscenceThemes.includes(p.theme))
    const pool = active.length > 0 ? active : REMINISCENCE_PROMPTS
    return shuffle(pool).slice(0, cfg.promptCount)
  })
  const [index, setIndex] = useState(0)
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [startedAt] = useState(() => Date.now())

  const prompt = prompts[index]
  const done = index >= prompts.length

  const next = () => {
    if (index + 1 >= prompts.length) {
      logSession('reminiscence', 1, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
  }

  return (
    <PageShell title="Memory Lane">
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises', label: 'Brain Exercises' }} />
      ) : (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
          <p className="text-lg font-semibold uppercase tracking-wide text-teal-dark opacity-80">{prompt.theme}</p>
          <span className="text-7xl" aria-hidden="true">
            {prompt.emoji}
          </span>
          <p className="text-2xl font-bold">{prompt.prompt}</p>
          <p className="text-lg opacity-70">Talk it through with family, or jot a word or two below.</p>
          <textarea
            value={notes[index] ?? ''}
            onChange={(e) => setNotes((n) => ({ ...n, [index]: e.target.value }))}
            placeholder="(optional)"
            rows={2}
            className="w-full rounded-xl border-2 border-ink/20 bg-white p-3 text-lg"
          />
          <button
            onClick={next}
            className="btn-primary w-full rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {index + 1 >= prompts.length ? 'Finish' : 'Next memory'}
          </button>
        </div>
      )}
    </PageShell>
  )
}
