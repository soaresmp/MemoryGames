import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { CATEGORY_SETS, type CategoryItem } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

function buildTrial(): CategoryItem[] {
  const set = shuffle(CATEGORY_SETS)[0]
  const [majorityKey, minorityKey] = shuffle(set.categoryKeys)
  const majority = shuffle(set.items.filter((i) => i.categoryKey === majorityKey)).slice(0, 3)
  const minority = shuffle(set.items.filter((i) => i.categoryKey === minorityKey)).slice(0, 1)
  return shuffle([...majority, ...minority])
}

export default function OddOneOutExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].oddOneOut

  const [trialIndex, setTrialIndex] = useState(0)
  const [trial, setTrial] = useState<CategoryItem[]>(() => buildTrial())
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const done = trialIndex >= cfg.trialCount

  const oddItem = trial.reduce<CategoryItem | null>((acc, item) => {
    const sameCategoryCount = trial.filter((i) => i.categoryKey === item.categoryKey).length
    return sameCategoryCount === 1 ? item : acc
  }, null)

  const choose = (item: CategoryItem) => {
    if (feedback) return
    if (item.itemKey === oddItem?.itemKey) {
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
    } else {
      setFeedback('hint')
    }
  }

  const next = () => {
    if (trialIndex + 1 >= cfg.trialCount) {
      logSession('oddOneOut', correctCount / cfg.trialCount, Math.round((Date.now() - startedAt) / 1000))
    }
    setTrial(buildTrial())
    setFeedback(null)
    setTrialIndex((i) => i + 1)
  }

  return (
    <PageShell title={t('oddOneOut.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/trivia', label: t('exerciseHub.triviaTitle') }} />
      ) : (
        <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-6 text-center">
          <p className="mb-2 text-lg opacity-70">{t('checkin.step', { current: trialIndex + 1, total: cfg.trialCount })}</p>
          <p className="mb-5 text-xl font-bold">{t('oddOneOut.prompt')}</p>
          <div className="grid grid-cols-2 gap-4">
            {trial.map((item) => (
              <button
                key={item.itemKey}
                onClick={() => choose(item)}
                className={`surface flex flex-col items-center gap-2 rounded-2xl border-4 p-5 transition-colors ${
                  feedback && item.itemKey === oddItem?.itemKey
                    ? 'border-amber bg-amber text-white'
                    : 'border-ink/20 bg-white hover:bg-cream-dark'
                }`}
              >
                <span className="text-5xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="text-lg font-semibold">{t(`sort.item.${item.itemKey}`)}</span>
              </button>
            ))}
          </div>
          <GentleFeedback state={feedback} />
          {feedback && (
            <button
              onClick={next}
              className="btn-primary mt-5 w-full rounded-xl bg-teal p-4 text-xl font-bold text-white hover:bg-teal-dark"
            >
              {t('common.continue')}
            </button>
          )}
        </div>
      )}
    </PageShell>
  )
}
