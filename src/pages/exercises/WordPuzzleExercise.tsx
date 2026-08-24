import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { WORD_PUZZLE_KEYS } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

interface WordDef {
  word: string
  clue: string
  emoji: string
  row: number
  col: number
  direction: 'across' | 'down'
}

interface PuzzleData {
  words: WordDef[]
}

interface PrefilledLetter {
  index: number
  letter: string
}

/** Every grid cell a word occupies, with its letter. */
function wordCells(w: WordDef) {
  return w.word.split('').map((letter, i) => ({
    row: w.direction === 'down' ? w.row + i : w.row,
    col: w.direction === 'across' ? w.col + i : w.col,
    letter,
  }))
}

/** Which letters of `w` are already known from words solved earlier in this puzzle. */
function prefilledFor(w: WordDef, gridMap: Map<string, string>): PrefilledLetter[] {
  return wordCells(w)
    .map((c, index) => ({ index, letter: gridMap.get(`${c.row},${c.col}`) }))
    .filter((p): p is PrefilledLetter => p.letter !== undefined)
}

/** Spell one word by tapping shuffled letter tiles in order — no free typing. */
function SpellingTask({
  clue,
  emoji,
  word,
  prefilled,
  crossingNote,
  onResult,
}: {
  clue: string
  emoji: string
  word: string
  prefilled: PrefilledLetter[]
  crossingNote?: string
  onResult: (correct: boolean) => void
}) {
  const { t } = useTranslation()
  const [filled, setFilled] = useState<string[]>(() => {
    const initial = Array(word.length).fill('')
    prefilled.forEach((p) => (initial[p.index] = p.letter))
    return initial
  })
  const [bank] = useState<string[]>(() => {
    const consumed = new Set(prefilled.map((p) => p.index))
    return shuffle(word.split('').filter((_, i) => !consumed.has(i)))
  })
  const [usedTiles, setUsedTiles] = useState<boolean[]>(() => Array(bank.length).fill(false))
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const prefilledIndices = new Set(prefilled.map((p) => p.index))

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
              prefilledIndices.has(i) ? 'border-teal bg-soft-teal' : 'border-ink/20 bg-white'
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

/** Compact live preview of the whole crossword grid, filling in as each word is solved. */
function CrosswordPreview({
  allWords,
  gridMap,
  activeWord,
}: {
  allWords: WordDef[]
  gridMap: Map<string, string>
  activeWord: WordDef
}) {
  const allCells = allWords.flatMap(wordCells)
  const rows = allCells.map((c) => c.row)
  const cols = allCells.map((c) => c.col)
  const minRow = Math.min(...rows)
  const maxRow = Math.max(...rows)
  const minCol = Math.min(...cols)
  const maxCol = Math.max(...cols)
  const belongsToWord = new Set(allCells.map((c) => `${c.row},${c.col}`))
  const activeCells = new Set(wordCells(activeWord).map((c) => `${c.row},${c.col}`))

  const cells = []
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const key = `${r},${c}`
      if (!belongsToWord.has(key)) {
        cells.push(<div key={key} className="h-9 w-9" aria-hidden="true" />)
        continue
      }
      const letter = gridMap.get(key)
      const isActive = activeCells.has(key)
      cells.push(
        <div
          key={key}
          className={`flex h-9 w-9 items-center justify-center rounded border-2 text-base font-bold ${
            isActive ? 'border-teal bg-white' : letter ? 'border-ink/30 bg-white' : 'border-ink/10 bg-ink/5'
          }`}
        >
          {letter ?? ''}
        </div>,
      )
    }
  }

  return (
    <div
      className="mx-auto mb-2 grid gap-1"
      style={{ gridTemplateColumns: `repeat(${maxCol - minCol + 1}, minmax(0,1fr))`, width: 'fit-content' }}
    >
      {cells}
    </div>
  )
}

function PuzzleTrial({
  puzzle,
  showCrossing,
  stepLabel,
  onWordResult,
  onDone,
}: {
  puzzle: PuzzleData
  showCrossing: boolean
  stepLabel: string
  onWordResult: (correct: boolean) => void
  onDone: () => void
}) {
  const { t } = useTranslation()
  const words = showCrossing ? puzzle.words : puzzle.words.slice(0, 1)
  const [wordIndex, setWordIndex] = useState(0)
  const [gridMap, setGridMap] = useState<Map<string, string>>(new Map())

  const current = words[wordIndex]
  const prefilled = prefilledFor(current, gridMap)

  return (
    <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-6 text-center">
      <p className="mb-3 text-lg opacity-70">{stepLabel}</p>
      {words.length > 1 && <CrosswordPreview allWords={words} gridMap={gridMap} activeWord={current} />}
      <SpellingTask
        key={wordIndex}
        clue={current.clue}
        emoji={current.emoji}
        word={current.word}
        prefilled={prefilled}
        crossingNote={prefilled.length > 0 ? t('wordPuzzle.crossingNote') : undefined}
        onResult={(correct) => {
          onWordResult(correct)
          setGridMap((prev) => {
            const next = new Map(prev)
            wordCells(current).forEach((c) => next.set(`${c.row},${c.col}`, c.letter))
            return next
          })
          if (wordIndex + 1 >= words.length) onDone()
          else setWordIndex((i) => i + 1)
        }}
      />
    </div>
  )
}

export default function WordPuzzleExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].wordPuzzle

  const [puzzleKeys] = useState(() => shuffle(WORD_PUZZLE_KEYS).slice(0, cfg.puzzleCount))
  const puzzles = useMemo(
    () => puzzleKeys.map((key) => t(`wordPuzzle.puzzles.${key}`, { returnObjects: true }) as PuzzleData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [puzzleKeys],
  )
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const done = index >= puzzles.length
  const totalWords = puzzles.reduce((sum, p) => sum + (cfg.showCrossing ? p.words.length : 1), 0)

  const nextPuzzle = () => {
    if (index + 1 >= puzzles.length) {
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
          puzzle={puzzles[index]}
          showCrossing={cfg.showCrossing}
          stepLabel={t('checkin.step', { current: index + 1, total: puzzles.length })}
          onWordResult={(correct) => {
            if (correct) setCorrectCount((c) => c + 1)
          }}
          onDone={nextPuzzle}
        />
      )}
    </PageShell>
  )
}
