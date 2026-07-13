import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell, GentleFeedback } from '../../components/ui'
import SessionComplete from '../../components/SessionComplete'
import { useProfile } from '../../lib/ProfileContext'
import { STAGE_CONFIG } from '../../lib/difficulty'
import { PATTERN_PADS } from '../../lib/sampleData'

const TONE_CLASSES: Record<string, { base: string; active: string }> = {
  sun: { base: 'border-amber bg-soft-amber', active: 'border-amber bg-amber text-white' },
  clover: { base: 'border-teal bg-soft-teal', active: 'border-teal bg-teal text-white' },
  blossom: { base: 'border-rose bg-soft-rose', active: 'border-rose bg-rose text-white' },
  star: { base: 'border-gold bg-soft-gold', active: 'border-gold bg-gold text-white' },
}

type Phase = 'showing' | 'input' | 'feedback'

export default function PatternRepeatExercise() {
  const { profile, logSession } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].patternRepeat

  const [round, setRound] = useState(0)
  const [sequence, setSequence] = useState<string[]>(() => buildSequence(cfg.minLength))
  const [phase, setPhase] = useState<Phase>('showing')
  const [highlight, setHighlight] = useState<string | null>(null)
  const [userInput, setUserInput] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null)
  const [successCount, setSuccessCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  function buildSequence(length: number) {
    return Array.from({ length }, () => PATTERN_PADS[Math.floor(Math.random() * PATTERN_PADS.length)].key)
  }

  const done = round >= cfg.rounds

  useEffect(() => {
    if (done || phase !== 'showing') return
    let cancelled = false
    let i = 0
    const step = () => {
      if (cancelled) return
      if (i >= sequence.length) {
        setHighlight(null)
        setPhase('input')
        return
      }
      setHighlight(sequence[i])
      setTimeout(() => {
        if (cancelled) return
        setHighlight(null)
        setTimeout(() => {
          i += 1
          step()
        }, 250)
      }, cfg.showMs)
    }
    step()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase])

  const tapPad = (key: string) => {
    if (phase !== 'input') return
    const next = [...userInput, key]
    const index = next.length - 1
    if (key !== sequence[index]) {
      setUserInput(next)
      setFeedback('hint')
      setPhase('feedback')
      return
    }
    setUserInput(next)
    if (next.length === sequence.length) {
      setFeedback('correct')
      setPhase('feedback')
      setSuccessCount((c) => c + 1)
    }
  }

  const nextRound = () => {
    if (round + 1 >= cfg.rounds) {
      logSession('patternRepeat', successCount / cfg.rounds, Math.round((Date.now() - startedAt) / 1000))
    }
    const length = Math.min(cfg.minLength + round + 1, cfg.maxLength)
    setSequence(buildSequence(length))
    setUserInput([])
    setFeedback(null)
    setPhase('showing')
    setRound((r) => r + 1)
  }

  return (
    <PageShell title={t('patternRepeat.pageTitle')}>
      {done ? (
        <SessionComplete nextTo={{ to: '/exercises/naming', label: t('exerciseHub.namingTitle') }} />
      ) : (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-6 text-center">
          <p className="text-lg opacity-70">{t('checkin.step', { current: round + 1, total: cfg.rounds })}</p>
          <p className="text-2xl font-bold">
            {phase === 'showing' ? t('patternRepeat.watchPrompt') : t('patternRepeat.repeatPrompt')}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {PATTERN_PADS.map((pad) => {
              const tone = TONE_CLASSES[pad.key]
              const isActive = highlight === pad.key
              return (
                <button
                  key={pad.key}
                  onClick={() => tapPad(pad.key)}
                  disabled={phase !== 'input'}
                  aria-label={pad.key}
                  className={`flex h-24 w-24 items-center justify-center rounded-2xl border-4 text-5xl transition-colors sm:h-28 sm:w-28 ${
                    isActive ? tone.active : tone.base
                  }`}
                >
                  {pad.emoji}
                </button>
              )
            })}
          </div>
          <GentleFeedback state={feedback} />
          {feedback && (
            <button
              onClick={nextRound}
              className="btn-primary w-full max-w-xs rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
            >
              {t('common.continue')}
            </button>
          )}
        </div>
      )}
    </PageShell>
  )
}
