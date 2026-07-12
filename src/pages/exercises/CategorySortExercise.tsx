import { useState } from 'react'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { CATEGORY_SETS, type CategoryItem } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

export default function CategorySortExercise() {
  const { profile, logSession } = useProfile()
  const cfg = STAGE_CONFIG[profile.stage].categorySort

  const [set] = useState(() => shuffle(CATEGORY_SETS)[0])
  const [items] = useState<CategoryItem[]>(() => {
    const perCategory = Math.ceil(cfg.itemCount / set.categories.length)
    const grouped = set.categories.flatMap((cat) =>
      shuffle(set.items.filter((i) => i.category === cat)).slice(0, perCategory),
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

  const choose = (category: string) => {
    if (feedback) return
    if (category === item.category) {
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
    } else {
      setFeedback('hint')
      setChosenWrong(category)
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
    <PageShell title="Sort It Out">
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/routine', label: 'What Comes Next' }} />
      ) : (
        <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6 text-center">
          <p className="mb-3 text-xl opacity-80">Where does this belong?</p>
          <p className="mb-6 text-3xl font-extrabold">
            <span className="mr-3 text-6xl" aria-hidden="true">
              {item.emoji}
            </span>
            {item.label}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {set.categories.map((category) => (
              <button
                key={category}
                onClick={() => choose(category)}
                className={`flex-1 rounded-xl border-4 p-5 text-xl font-bold transition-colors ${
                  feedback && category === item.category
                    ? 'border-teal bg-teal text-white'
                    : chosenWrong === category
                      ? 'border-ink/30 bg-white opacity-60'
                      : 'border-ink/20 bg-white hover:bg-cream-dark'
                }`}
              >
                {category}
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
