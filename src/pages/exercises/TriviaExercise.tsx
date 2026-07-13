import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { TRIVIA_QUESTION_KEYS } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

export default function TriviaExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].trivia

  const [questionKeys] = useState(() => shuffle(TRIVIA_QUESTION_KEYS).slice(0, cfg.questionCount))
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const done = index >= questionKeys.length

  const next = () => {
    if (index + 1 >= questionKeys.length) {
      logSession('trivia', correctCount / questionKeys.length, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
    setFeedback(null)
  }

  return (
    <PageShell title={t('trivia.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/reminisce', label: t('home.reminisceTitle') }} />
      ) : (
        <TriviaQuestion
          key={index}
          questionKey={questionKeys[index]}
          choiceCount={cfg.choiceCount}
          feedback={feedback}
          onAnswer={(correct) => {
            setFeedback(correct ? 'correct' : 'hint')
            if (correct) setCorrectCount((c) => c + 1)
          }}
          onContinue={next}
        />
      )}
    </PageShell>
  )
}

function TriviaQuestion({
  questionKey,
  choiceCount,
  feedback,
  onAnswer,
  onContinue,
}: {
  questionKey: string
  choiceCount: number
  feedback: 'correct' | 'hint' | null
  onAnswer: (correct: boolean) => void
  onContinue: () => void
}) {
  const { t } = useTranslation()
  const options = t(`trivia.questions.${questionKey}.options`, { returnObjects: true }) as string[]
  const correctAnswer = options[0]
  const [choices] = useState(() => shuffle([options[0], ...shuffle(options.slice(1)).slice(0, choiceCount - 1)]))

  return (
    <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6 text-center">
      <p className="mb-5 text-2xl font-bold">{t(`trivia.questions.${questionKey}.prompt`)}</p>
      <div className="flex flex-col gap-3">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => {
              if (feedback) return
              onAnswer(choice === correctAnswer)
            }}
            className={`rounded-xl border-4 p-4 text-xl font-semibold transition-colors ${
              feedback && choice === correctAnswer
                ? 'border-teal bg-teal text-white'
                : 'border-ink/20 bg-white hover:bg-cream-dark'
            }`}
          >
            {choice}
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
