import { useMemo, useState } from 'react'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { pickDistractors, shuffle } from '../../lib/util'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn']

function seasonForMonth(monthIndex: number): string {
  // Northern-hemisphere default; a caregiver setting could flip this per region in a future iteration.
  if ([11, 0, 1].includes(monthIndex)) return 'Winter'
  if ([2, 3, 4].includes(monthIndex)) return 'Spring'
  if ([5, 6, 7].includes(monthIndex)) return 'Summer'
  return 'Autumn'
}

function timeOfDay(hour: number): string {
  if (hour < 12) return 'Morning'
  if (hour < 18) return 'Afternoon'
  return 'Evening'
}

interface Question {
  prompt: string
  emoji: string
  correct: string
  choices: string[]
}

function buildQuestions(choiceCount: number): Question[] {
  const now = new Date()
  const day = DAYS[now.getDay()]
  const month = MONTHS[now.getMonth()]
  const season = seasonForMonth(now.getMonth())
  const tod = timeOfDay(now.getHours())

  const extra = choiceCount - 1
  return shuffle([
    {
      prompt: 'What day of the week is it today?',
      emoji: '📅',
      correct: day,
      choices: shuffle([day, ...pickDistractors(DAYS, day, extra)]),
    },
    {
      prompt: 'What month are we in?',
      emoji: '🗓️',
      correct: month,
      choices: shuffle([month, ...pickDistractors(MONTHS, month, extra)]),
    },
    {
      prompt: 'What season is it?',
      emoji: '🍂',
      correct: season,
      choices: shuffle([season, ...pickDistractors(SEASONS, season, extra)]),
    },
    {
      prompt: 'Is it morning, afternoon, or evening right now?',
      emoji: '🕐',
      correct: tod,
      choices: shuffle([tod, ...pickDistractors(['Morning', 'Afternoon', 'Evening'], tod, extra)]),
    },
  ])
}

export default function OrientationExercise() {
  const { profile, logSession } = useProfile()
  const cfg = STAGE_CONFIG[profile.stage].orientation
  const [questions] = useState(() => buildQuestions(cfg.choiceCount).slice(0, cfg.questionCount))
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
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  )

  return (
    <PageShell title="Where & When">
      <div className="surface mb-6 rounded-2xl border-4 border-teal bg-soft-teal p-5 text-center">
        <p className="text-2xl font-bold text-teal-dark">Today is {today}</p>
      </div>

      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/faces', label: 'Faces I Know' }} />
      ) : (
        <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6">
          <p className="mb-5 text-2xl font-bold">
            <span aria-hidden="true">{question.emoji} </span>
            {question.prompt}
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
              Continue
            </button>
          )}
        </div>
      )}
    </PageShell>
  )
}
