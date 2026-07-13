import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { MATCH_PAIR_EMOJIS } from '../../lib/sampleData'
import { shuffle } from '../../lib/util'

interface Card {
  id: number
  emoji: string
  matched: boolean
}

export default function MatchPairsExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].matchPairs

  const [cards] = useState<Card[]>(() => {
    const chosen = shuffle(MATCH_PAIR_EMOJIS).slice(0, cfg.pairCount)
    const pairs = shuffle([...chosen, ...chosen]).map((emoji, id) => ({ id, emoji, matched: false }))
    return pairs
  })
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<number[]>([])
  const [revealAll, setRevealAll] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [locked, setLocked] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealAll(false)
      setLocked(false)
    }, cfg.revealMs)
    return () => clearTimeout(timer)
  }, [cfg.revealMs])

  const done = matched.size === cards.length

  useEffect(() => {
    if (done) {
      const success = Math.min(1, cards.length / 2 / Math.max(attempts, 1))
      logSession('matchPairs', success, Math.round((Date.now() - startedAt) / 1000))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const flip = (id: number) => {
    if (locked || revealAll || matched.has(id) || selected.includes(id) || selected.length === 2) return
    const next = [...selected, id]
    setSelected(next)

    if (next.length === 2) {
      setLocked(true)
      setAttempts((a) => a + 1)
      const [a, b] = next
      const isMatch = cards[a].emoji === cards[b].emoji
      setTimeout(() => {
        if (isMatch) {
          setMatched((prev) => new Set(prev).add(a).add(b))
        }
        setSelected([])
        setLocked(false)
      }, isMatch ? 500 : 900)
    }
  }

  return (
    <PageShell title={t('match.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/sort', label: t('exerciseHub.sortTitle') }} />
      ) : (
        <>
          <p className="mb-5 text-xl opacity-80">{revealAll ? t('match.revealHint') : t('match.playHint')}</p>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${Math.min(cfg.columns, cards.length)}, minmax(0, 1fr))` }}
          >
            {cards.map((card) => {
              const faceUp = revealAll || selected.includes(card.id) || matched.has(card.id)
              return (
                <button
                  key={card.id}
                  onClick={() => flip(card.id)}
                  aria-label={faceUp ? card.emoji : t('match.hiddenCardLabel')}
                  className={`surface flex aspect-square items-center justify-center rounded-2xl border-4 text-4xl transition-colors sm:text-5xl ${
                    matched.has(card.id)
                      ? 'border-teal bg-soft-teal'
                      : faceUp
                        ? 'border-amber bg-soft-amber'
                        : 'border-ink/20 bg-cream-dark'
                  }`}
                >
                  {faceUp ? card.emoji : '❓'}
                </button>
              )
            })}
          </div>
        </>
      )}
    </PageShell>
  )
}
