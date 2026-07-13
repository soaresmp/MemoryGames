import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { pickDistractors, shuffle } from '../../lib/util'
import { DATE_LOCALE, SOUTHERN_HEMISPHERE, type Language } from '../../i18n'

function seasonIndexForMonth(monthIndex: number, southernHemisphere: boolean): number {
  // index into ['winter', 'spring', 'summer', 'autumn']; flipped for the southern hemisphere.
  let season = 0 // winter
  if ([2, 3, 4].includes(monthIndex)) season = 1 // spring
  else if ([5, 6, 7].includes(monthIndex)) season = 2 // summer
  else if ([8, 9, 10].includes(monthIndex)) season = 3 // autumn

  return southernHemisphere ? (season + 2) % 4 : season
}

function timeOfDayKey(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

interface Question {
  promptKey: string
  emoji: string
  correct: string
  choices: string[]
}

export default function OrientationExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].orientation
  const language = profile.language as Language

  const [questions] = useState(() => {
    const days = t('orientation.days', { returnObjects: true }) as string[]
    const months = t('orientation.months', { returnObjects: true }) as string[]
    const seasons = [
      t('orientation.seasons.winter'),
      t('orientation.seasons.spring'),
      t('orientation.seasons.summer'),
      t('orientation.seasons.autumn'),
    ]
    const timesOfDay = [t('orientation.timeOfDay.morning'), t('orientation.timeOfDay.afternoon'), t('orientation.timeOfDay.evening')]

    const now = new Date()
    const day = days[now.getDay()]
    const month = months[now.getMonth()]
    const season = seasons[seasonIndexForMonth(now.getMonth(), SOUTHERN_HEMISPHERE[language])]
    const tod = timesOfDay[['morning', 'afternoon', 'evening'].indexOf(timeOfDayKey(now.getHours()))]

    const extra = cfg.choiceCount - 1
    const all: Question[] = shuffle([
      { promptKey: 'orientation.q1', emoji: '📅', correct: day, choices: shuffle([day, ...pickDistractors(days, day, extra)]) },
      { promptKey: 'orientation.q2', emoji: '🗓️', correct: month, choices: shuffle([month, ...pickDistractors(months, month, extra)]) },
      { promptKey: 'orientation.q3', emoji: '🍂', correct: season, choices: shuffle([season, ...pickDistractors(seasons, season, extra)]) },
      { promptKey: 'orientation.q4', emoji: '🕐', correct: tod, choices: shuffle([tod, ...pickDistractors(timesOfDay, tod, extra)]) },
    ])
    return all.slice(0, cfg.questionCount)
  })
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [revealedAnswer, setRevealedAnswer] = useState(false)
  const [startedAt] = useState(() => Date.now())

  const question = questions[index]
  const done = index >= questions.length

  const answer = (choice: string) => {
    if (feedback) return
    if (choice === question.correct) {
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
    } else {
      setFeedback('hint')
      setRevealedAnswer(true)
    }
  }

  const next = () => {
    if (index + 1 >= questions.length) {
      logSession('orientation', correctCount / questions.length, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
    setFeedback(null)
    setRevealedAnswer(false)
  }

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(DATE_LOCALE[language], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [language],
  )

  return (
    <PageShell title={t('orientation.pageTitle')}>
      <div className="surface mb-6 rounded-2xl border-4 border-teal bg-soft-teal p-5 text-center">
        <p className="text-2xl font-bold text-teal-dark">{t('orientation.todayIs', { date: today })}</p>
      </div>

      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/faces', label: t('exerciseHub.faceNameTitle') }} />
      ) : (
        <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6">
          <p className="mb-5 text-2xl font-bold">
            <span aria-hidden="true">{question.emoji} </span>
            {t(question.promptKey)}
          </p>
          <div className="flex flex-col gap-3">
            {question.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => answer(choice)}
                className={`rounded-xl border-4 p-4 text-xl font-semibold transition-colors ${
                  revealedAnswer && choice === question.correct
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
