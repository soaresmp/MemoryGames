import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { WORD_PUZZLE_KEYS } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

interface PuzzleData {
  wordA: string
  shareIndexA: number
  clueA: string
  emojiA: string
  wordB: string
  shareIndexB: number
  clueB: string
  emojiB: string
}

/** Spell one word by tapping shuffled letter tiles in order — no free typing. */
function SpellingTask({
  clue,
  emoji,
  word,
  prefilledIndex,
  prefilledLetter,
  crossingNote,
  onResult,
}: {
  clue: string
  emoji: string
  word: string
  prefilledIndex?: number
  prefilledLetter?: string
  crossingNote?: string
  onResult: (correct: boolean) => void
}) {
  const { t } = useTranslation()
  const [filled, setFilled] = useState<string[]>(() => {
    const initial = Array(word.length).fill('')
    if (prefilledIndex !== undefined && prefilledLetter) initial[prefilledIndex] = prefilledLetter
    return initial
  })
  const [bank] = useState<string[]>(() => {
    const letters = word.split('')
    if (prefilledLetter) {
      const idx = letters.indexOf(prefilledLetter)
      if (idx !== -1) letters.splice(idx, 1)
    }
    return shuffle(letters)
  })
  const [usedTiles, setUsedTiles] = useState<boolean[]>(() => Array(bank.length).fill(false))
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)

  const place = (tileIndex: number) => {
    if (feedback || usedTiles[tileIndex]) return
    const nextEmpty = filled.findIndex((c) => c === '')
    if (nextEmpty === -1) return
    const updated = [...filled]
    updated[nextEmpty] = bank[tileIndex]
    setFilled(updated)
    setUsedTiles((u) => u.map((used, i) => (i === tileIndex ? true : used)))

    if (!updated.includes('')) {
      const assembled = updated.join('')
      const correct = assembled === word
      setFeedback(correct ? 'correct' : 'hint')
      if (!correct) setFilled(word.split(''))
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-6xl" aria-hidden="true">
        {emoji}
      </span>
      <p className="text-xl font-bold">{clue}</p>
      {crossingNote && <p className="text-base opacity-70">{crossingNote}</p>}
      <div className="flex justify-center gap-2">
        {filled.map((letter, i) => (
          <div
            key={i}
            className={`flex h-12 w-12 items-center justify-center rounded-lg border-4 text-2xl font-bold ${
              i === prefilledIndex ? 'border-teal bg-soft-teal' : 'border-ink/20 bg-white'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {bank.map((letter, i) => (
          <button
            key={i}
            onClick={() => place(i)}
            disabled={usedTiles[i] || !!feedback}
            className="flex h-12 w-12 items-center justify-center rounded-lg border-4 border-amber bg-soft-amber text-2xl font-bold disabled:opacity-30"
          >
            {letter}
          </button>
        ))}
      </div>
      <GentleFeedback state={feedback} />
      {feedback && (
        <button
          onClick={() => onResult(feedback === 'correct')}
          className="btn-primary w-full max-w-xs rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
        >
          {t('common.continue')}
        </button>
      )}
    </div>
  )
}

function PuzzleTrial({
  puzzleKey,
  showCrossing,
  stepLabel,
  onWordResult,
  onDone,
}: {
  puzzleKey: string
  showCrossing: boolean
  stepLabel: string
  onWordResult: (correct: boolean) => void
  onDone: () => void
}) {
  const { t } = useTranslation()
  const puzzle = t(`wordPuzzle.puzzles.${puzzleKey}`, { returnObjects: true }) as PuzzleData
  const [phase, setPhase] = useState<'wordA' | 'wordB'>('wordA')

  return (
    <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-6 text-center">
      <p className="mb-3 text-lg opacity-70">{stepLabel}</p>
      {phase === 'wordA' && (
        <SpellingTask
          key="A"
          clue={puzzle.clueA}
          emoji={puzzle.emojiA}
          word={puzzle.wordA}
          onResult={(correct) => {
            onWordResult(correct)
            if (showCrossing) setPhase('wordB')
            else onDone()
          }}
        />
      )}
      {phase === 'wordB' && showCrossing && (
        <SpellingTask
          key="B"
          clue={puzzle.clueB}
          emoji={puzzle.emojiB}
          word={puzzle.wordB}
          prefilledIndex={puzzle.shareIndexB}
          prefilledLetter={puzzle.wordA[puzzle.shareIndexA]}
          crossingNote={t('wordPuzzle.crossingNote')}
          onResult={(correct) => {
            onWordResult(correct)
            onDone()
          }}
        />
      )}
    </div>
  )
}

export default function WordPuzzleExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].wordPuzzle

  const [puzzleKeys] = useState(() => shuffle(WORD_PUZZLE_KEYS).slice(0, cfg.puzzleCount))
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const done = index >= puzzleKeys.length
  const totalWords = puzzleKeys.length * (cfg.showCrossing ? 2 : 1)

  const nextPuzzle = () => {
    if (index + 1 >= puzzleKeys.length) {
      logSession('wordPuzzle', correctCount / totalWords, Math.round((Date.now() - startedAt) / 1000))
    }
    setIndex((i) => i + 1)
  }

  return (
    <PageShell title={t('wordPuzzle.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/reminisce', label: t('home.reminisceTitle') }} />
      ) : (
        <PuzzleTrial
          key={index}
          puzzleKey={puzzleKeys[index]}
          showCrossing={cfg.showCrossing}
          stepLabel={t('checkin.step', { current: index + 1, total: puzzleKeys.length })}
          onWordResult={(correct) => {
            if (correct) setCorrectCount((c) => c + 1)
          }}
          onDone={nextPuzzle}
        />
      )}
    </PageShell>
  )
}
