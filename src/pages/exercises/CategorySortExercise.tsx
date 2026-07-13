import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { CATEGORY_SETS, type CategoryItem } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

export default function CategorySortExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].categorySort

  const [set] = useState(() => shuffle(CATEGORY_SETS)[0])
  const [items] = useState<CategoryItem[]>(() => {
    const perCategory = Math.ceil(cfg.itemCount / set.categoryKeys.length)
    const grouped = set.categoryKeys.flatMap((cat) =>
      shuffle(set.items.filter((i) => i.categoryKey === cat)).slice(0, perCategory),
    )
    return shuffle(grouped).slice(0, cfg.itemCount)
  })

  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [chosenWrong, setChosenWrong] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const item = items[index]
  const done = index >= items.length

  const choose = (categoryKey: string) => {
    if (feedback) return
    if (categoryKey === item.categoryKey) {
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
    } else {
      setFeedback('hint')
      setChosenWrong(categoryKey)
    }
  }

  const next = () => {
    if (index + 1 >= items.length) {
      logSession('categorySort', correctCount / items.length, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
    setFeedback(null)
    setChosenWrong(null)
  }

  return (
    <PageShell title={t('sort.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/routine', label: t('exerciseHub.routineTitle') }} />
      ) : (
        <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6 text-center">
          <p className="mb-3 text-xl opacity-80">{t('sort.prompt')}</p>
          <p className="mb-6 text-3xl font-extrabold">
            <span className="mr-3 text-6xl" aria-hidden="true">
              {item.emoji}
            </span>
            {t(`sort.item.${item.itemKey}`)}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {set.categoryKeys.map((categoryKey) => (
              <button
                key={categoryKey}
                onClick={() => choose(categoryKey)}
                className={`flex-1 rounded-xl border-4 p-5 text-xl font-bold transition-colors ${
                  feedback && categoryKey === item.categoryKey
                    ? 'border-teal bg-teal text-white'
                    : chosenWrong === categoryKey
                      ? 'border-ink/30 bg-white opacity-60'
                      : 'border-ink/20 bg-white hover:bg-cream-dark'
                }`}
              >
                {t(`sort.category.${categoryKey}`)}
              </button>
            ))}
          </div>
          <GentleFeedback state={feedback} />
          {feedback && (
            <button
              onClick={next}
              className="btn-primary mt-5 w-full rounded-xl bg-amber p-4 text-xl font-bold text-white hover:bg-amber-dark"
            >
              {t('common.continue')}
            </button>
          )}
        </div>
      )}
    </PageShell>
  )
}
