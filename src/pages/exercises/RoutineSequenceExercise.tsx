import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { ROUTINE_SETS } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

interface Step {
  id: number
  label: string
  emoji: string
}

export default function RoutineSequenceExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].routineSequence

  const [routine] = useState(() => shuffle(ROUTINE_SETS)[0])
  const routineTitle = t(`routine.sets.${routine.setKey}.title`)
  const [correctSteps] = useState<Step[]>(() => {
    const stepLabels = t(`routine.sets.${routine.setKey}.steps`, { returnObjects: true }) as string[]
    return routine.steps.slice(0, cfg.stepCount).map((s, id) => ({ id, emoji: s.emoji, label: stepLabels[id] }))
  })
  const [pool, setPool] = useState<Step[]>(() => shuffle(correctSteps))
  const [placed, setPlaced] = useState<Step[]>([])
  const [checked, setChecked] = useState(false)
  const [startedAt] = useState(() => Date.now())

  const place = (step: Step) => {
    if (checked) return
    setPool((p) => p.filter((s) => s.id !== step.id))
    setPlaced((p) => [...p, step])
  }

  const check = () => {
    setChecked(true)
    const matches = placed.filter((s, i) => s.id === correctSteps[i].id).length
    logSession('routineSequence', matches / correctSteps.length, Math.round((Date.now() - startedAt) / 1000))
  }

  const done = checked

  return (
    <PageShell title={t('routine.pageTitle')}>
      {done ? (
        <div className="flex flex-col gap-6">
          <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-6">
            <p className="mb-4 text-xl font-bold text-teal-dark">{t('routine.correctOrderLabel')}</p>
            <ol className="flex flex-col gap-2">
              {correctSteps.map((s, i) => (
                <li
                  key={s.id}
                  className={`rounded-lg p-3 text-lg font-semibold ${
                    placed[i]?.id === s.id ? 'bg-white' : 'bg-soft-amber'
                  }`}
                >
                  <span className="mr-2" aria-hidden="true">
                    {s.emoji}
                  </span>
                  {i + 1}. {s.label}
                </li>
              ))}
            </ol>
          </div>
          <SessionComplete nextTo={{ to: '/reminisce', label: t('home.reminisceTitle') }} />
        </div>
      ) : (
        <>
          <p className="mb-2 text-xl opacity-80">{routineTitle}</p>
          <p className="mb-5 text-lg opacity-70">{t('routine.instructions')}</p>

          <div className="surface mb-5 min-h-20 rounded-2xl border-4 border-dashed border-ink/20 bg-white p-4">
            {placed.length === 0 ? (
              <p className="text-lg opacity-50">{t('routine.placeholder')}</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {placed.map((s, i) => (
                  <li key={s.id} className="rounded-lg bg-soft-teal p-3 text-lg font-semibold">
                    <span className="mr-2" aria-hidden="true">
                      {s.emoji}
                    </span>
                    {i + 1}. {s.label}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {pool.map((s) => (
              <button
                key={s.id}
                onClick={() => place(s)}
                className="surface rounded-xl border-4 border-amber bg-soft-amber p-4 text-left text-xl font-semibold hover:bg-amber hover:text-white"
              >
                <span className="mr-2" aria-hidden="true">
                  {s.emoji}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          {pool.length === 0 && (
            <button
              onClick={check}
              className="btn-primary mt-5 w-full rounded-xl bg-teal p-4 text-xl font-bold text-white hover:bg-teal-dark"
            >
              {t('routine.checkButton')}
            </button>
          )}
        </>
      )}
    </PageShell>
  )
}
