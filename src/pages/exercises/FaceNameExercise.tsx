import { useEffect, useState } from 'react'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { applyRecallResult, dueLovedOnes } from '../../lib/spacedRetrieval'
import { pickDistractors, shuffle } from '../../lib/util'
import type { LovedOne } from '../../lib/types'

type Phase = 'study' | 'recall'

export default function FaceNameExercise() {
  const { profile, setProfile, logSession } = useProfile()
  const cfg = STAGE_CONFIG[profile.stage].faceName
  const [queue] = useState<LovedOne[]>(() => {
    const due = dueLovedOnes(profile.lovedOnes, Date.now())
    return shuffle(due.length > 0 ? due : profile.lovedOnes)
  })
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('study')
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [choices, setChoices] = useState<string[]>([])

  const person = queue[index]
  const done = index >= queue.length

  useEffect(() => {
    if (!person || phase !== 'recall') return
    const allNames = profile.lovedOnes.map((p) => p.name)
    setChoices(shuffle([person.name, ...pickDistractors(allNames, person.name, 2)]))
    setFeedback(null)

    const timer = setTimeout(() => {
      setFeedback((current) => current ?? 'hint')
    }, cfg.hintDelayMs)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase])

  if (done) {
    return (
      <PageShell title="Faces I Know">
        <SessionComplete nextTo={{ to: '/exercises/match', label: 'Matching Pairs' }} />
      </PageShell>
    )
  }

  const finishPerson = (result: 'correct' | 'prompted') => {
    setProfile((p) => ({
      ...p,
      lovedOnes: p.lovedOnes.map((lo) => (lo.id === person.id ? applyRecallResult(lo, result, Date.now()) : lo)),
    }))
    if (result === 'correct') setCorrectCount((c) => c + 1)
  }

  const answer = (choice: string) => {
    if (feedback === 'correct') return
    if (choice === person.name) {
      setFeedback('correct')
      finishPerson('correct')
    } else {
      setFeedback('hint')
      finishPerson('prompted')
    }
  }

  const next = () => {
    if (index + 1 >= queue.length) {
      logSession('faceName', correctCount / queue.length, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
    setPhase('study')
    setFeedback(null)
  }

  return (
    <PageShell title="Faces I Know">
      <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
        <span className="text-8xl" aria-hidden="true">
          {person.emoji}
        </span>

        {phase === 'study' ? (
          <>
            <p className="text-3xl font-extrabold">{person.name}</p>
            <p className="text-xl opacity-80">{person.relationship}</p>
            <button
              onClick={() => setPhase('recall')}
              className="btn-primary rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
            >
              I'll remember — test me
            </button>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold">Who is this?</p>
            <div className="flex w-full flex-col gap-3">
              {choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => answer(choice)}
                  className={`rounded-xl border-4 p-4 text-xl font-semibold transition-colors ${
                    feedback && choice === person.name
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
                className="btn-primary w-full rounded-xl bg-amber px-6 py-4 text-xl font-bold text-white hover:bg-amber-dark"
              >
                Continue
              </button>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
