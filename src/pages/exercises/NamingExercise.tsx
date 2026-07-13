import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { NAMING_ITEMS } from '../../lib/sampleData'
import { pickDistractors, shuffle } from '../../lib/util'

export default function NamingExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].naming

  const [items] = useState(() => shuffle(NAMING_ITEMS).slice(0, cfg.itemCount))
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const item = items[index]
  const done = index >= items.length

  const answer = (choice: string) => {
    if (feedback) return
    if (choice === item.itemKey) {
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
    } else {
      setFeedback('hint')
    }
  }

  const next = () => {
    if (index + 1 >= items.length) {
      logSession('naming', correctCount / items.length, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
    setFeedback(null)
  }

  return (
    <PageShell title={t('naming.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/odd-one-out', label: t('exerciseHub.oddOneOutTitle') }} />
      ) : (
        <NamingQuestion
          key={index}
          emoji={item.emoji}
          correctKey={item.itemKey}
          choiceCount={cfg.choiceCount}
          feedback={feedback}
          onAnswer={answer}
          onContinue={next}
        />
      )}
    </PageShell>
  )
}

function NamingQuestion({
  emoji,
  correctKey,
  choiceCount,
  feedback,
  onAnswer,
  onContinue,
}: {
  emoji: string
  correctKey: string
  choiceCount: number
  feedback: 'correct' | 'hint' | null
  onAnswer: (choice: string) => void
  onContinue: () => void
}) {
  const { t } = useTranslation()
  const [choices] = useState(() => {
    const allKeys = NAMING_ITEMS.map((i) => i.itemKey)
    return shuffle([correctKey, ...pickDistractors(allKeys, correctKey, choiceCount - 1)])
  })

  return (
    <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6 text-center">
      <p className="mb-3 text-xl opacity-80">{t('naming.prompt')}</p>
      <span className="mb-4 block text-7xl" aria-hidden="true">
        {emoji}
      </span>
      <div className="flex flex-col gap-3">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => onAnswer(choice)}
            className={`rounded-xl border-4 p-4 text-xl font-semibold transition-colors ${
              feedback && choice === correctKey
                ? 'border-teal bg-teal text-white'
                : 'border-ink/20 bg-white hover:bg-cream-dark'
            }`}
          >
            {t(`naming.item.${choice}`)}
          </button>
        ))}
      </div>
      <GentleFeedback state={feedback} />
      {feedback && (
        <button
          onClick={onContinue}
          className="btn-primary mt-5 w-full rounded-xl bg-amber p-4 text-xl font-bold text-white hover:bg-amber-dark"
        >
          {t('common.continue')}
        </button>
      )}
    </div>
  )
}
