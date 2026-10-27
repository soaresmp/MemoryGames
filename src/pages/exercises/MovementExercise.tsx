import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { MOVEMENT_ACTIVITIES } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

export default function MovementExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].movement

  const [activities] = useState(() => shuffle(MOVEMENT_ACTIVITIES).slice(0, cfg.stepCount))
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const done = index >= activities.length
  const activity = activities[index]

  const next = () => {
    if (index + 1 >= activities.length) {
      logSession('movement', 1, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
  }

  return (
    <PageShell title={t('movement.pageTitle')}>
      {!started ? (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
          <span className="text-6xl" aria-hidden="true">
            🧘
          </span>
          <p className="text-2xl font-bold">{t('movement.introTitle')}</p>
          <p className="text-lg opacity-70">{t('movement.disclaimer')}</p>
          <button
            onClick={() => setStarted(true)}
            className="btn-primary w-full max-w-xs rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {t('movement.startButton')}
          </button>
        </div>
      ) : done ? (
        <SessionComplete nextTo={{ to: '/reminisce', label: t('home.reminisceTitle') }} />
      ) : (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
          <p className="text-lg opacity-70">{t('checkin.step', { current: index + 1, total: activities.length })}</p>
          <span className="text-7xl" aria-hidden="true">
            {activity.emoji}
          </span>
          <p className="text-2xl font-bold">{t(`movement.activities.${activity.key}`)}</p>
          <button
            onClick={next}
            className="btn-primary w-full rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {index + 1 >= activities.length ? t('movement.finishButton') : t('movement.nextButton')}
          </button>
        </div>
      )}
    </PageShell>
  )
}
