import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../components/ui'
import ClockTask from './checkin/ClockTask'
import { useProfile } from '../lib/ProfileContext'
import { STAGE_CONFIG } from '../lib/difficulty'
import { saveCheckin } from '../lib/storage'
import { bandFromFlagCount, bandFromRatio, CAREGIVER_QUESTION_KEYS, WORD_BANK_KEYS } from '../lib/checkin'
import { shuffle } from '../lib/util'
import type {
  AttentionResult,
  CaregiverQuestionnaireResult,
  ClockResult,
  ObservationBand,
  WordRecallResult,
} from '../lib/types'

type Step = 'intro' | 'wordShow' | 'attention' | 'clock' | 'wordRecall' | 'caregiver' | 'summary'

const TARGET_HOUR = 11
const TARGET_MINUTE = 10

function BandBadge({ band }: { band: ObservationBand }) {
  const { t } = useTranslation()
  const tone = band === 'none' ? 'bg-soft-teal text-teal-dark' : 'bg-soft-amber text-amber-dark'
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${tone}`}>{t(`checkin.summary.band.${band}`)}</span>
}

export default function Checkin() {
  const { profile, setProfile } = useProfile()
  const { t } = useTranslation()
  const cfg = STAGE_CONFIG[profile.stage].checkin

  const [step, setStep] = useState<Step>('intro')
  const [words, setWords] = useState<string[]>([])
  const [attentionIndex, setAttentionIndex] = useState(0)
  const [attentionCorrect, setAttentionCorrect] = useState(0)
  const [clockResult, setClockResult] = useState<ClockResult | null>(null)
  const [recallText, setRecallText] = useState('')
  const [caregiverAnswers, setCaregiverAnswers] = useState<Record<string, 'yes' | 'no' | 'unsure'>>({})
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const begin = () => {
    setWords(shuffle(WORD_BANK_KEYS).slice(0, cfg.wordCount).map((k) => t(`checkin.words.${k}`)))
    setAttentionIndex(0)
    setAttentionCorrect(0)
    setClockResult(null)
    setRecallText('')
    setCaregiverAnswers({})
    setSaved(false)
    setStep('wordShow')
  }

  // --- Attention step ---
  const attentionCurrent = cfg.attentionStart - attentionIndex * cfg.attentionStep
  const attentionAnswer = attentionCurrent - cfg.attentionStep
  const attentionChoices = useMemo(() => {
    const step = cfg.attentionStep
    const distractors = [attentionAnswer + step, attentionAnswer - step >= 0 ? attentionAnswer - step : attentionAnswer + step * 2]
    return shuffle([attentionAnswer, ...distractors])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attentionIndex, cfg.attentionStep])

  return (
    <PageShell title={t('checkin.introTitle')}>
      {step === 'intro' && (
        <IntroStep onBegin={begin} checkinCount={profile.checkins.length} lastDate={profile.checkins.at(-1)?.date} />
      )}

      {step === 'wordShow' && (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
          <p className="text-2xl font-bold">{t('checkin.wordShow.title')}</p>
          <p className="text-lg opacity-80">{t('checkin.wordShow.instructions')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {words.map((w) => (
              <span key={w} className="rounded-xl bg-white px-4 py-3 text-2xl font-bold text-teal-dark">
                {w}
              </span>
            ))}
          </div>
          <button
            onClick={() => setStep('attention')}
            className="btn-primary w-full max-w-xs rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {t('checkin.wordShow.continueButton')}
          </button>
        </div>
      )}

      {step === 'attention' && (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-amber bg-soft-amber p-8 text-center">
          <p className="text-lg opacity-70">{t('checkin.step', { current: attentionIndex + 1, total: cfg.attentionSteps })}</p>
          <p className="text-2xl font-bold">
            {t('checkin.attention.prompt', { current: attentionCurrent, step: cfg.attentionStep })}
          </p>
          <div className="flex w-full max-w-xs flex-col gap-3">
            {attentionChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => {
                  if (choice === attentionAnswer) setAttentionCorrect((c) => c + 1)
                  if (attentionIndex + 1 >= cfg.attentionSteps) {
                    setStep('clock')
                  } else {
                    setAttentionIndex((i) => i + 1)
                  }
                }}
                className="rounded-xl border-4 border-ink/20 bg-white p-4 text-xl font-semibold hover:bg-cream-dark"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'clock' && (
        <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-6">
          <ClockTask
            showNumbers={cfg.clockShowsNumbers}
            targetHour={TARGET_HOUR}
            targetMinute={TARGET_MINUTE}
            onComplete={(result) => {
              setClockResult(result)
              setStep('wordRecall')
            }}
          />
        </div>
      )}

      {step === 'wordRecall' && (
        <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-amber bg-soft-amber p-8 text-center">
          <p className="text-2xl font-bold">{t('checkin.wordRecall.title')}</p>
          <p className="text-lg opacity-80">{t('checkin.wordRecall.instructions')}</p>
          <textarea
            value={recallText}
            onChange={(e) => setRecallText(e.target.value)}
            placeholder={t('checkin.wordRecall.placeholder')}
            rows={3}
            className="w-full rounded-xl border-2 border-ink/20 bg-white p-3 text-lg"
          />
          <button
            onClick={() => setStep('caregiver')}
            className="btn-primary w-full max-w-xs rounded-xl bg-amber px-6 py-4 text-xl font-bold text-white hover:bg-amber-dark"
          >
            {t('checkin.wordRecall.continueButton')}
          </button>
        </div>
      )}

      {step === 'caregiver' && (
        <div className="surface flex flex-col gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-6">
          <p className="text-2xl font-bold">{t('checkin.caregiver.title')}</p>
          <p className="text-lg opacity-80">{t('checkin.caregiver.instructions')}</p>
          {CAREGIVER_QUESTION_KEYS.map((qKey) => (
            <div key={qKey} className="rounded-xl bg-white p-4">
              <p className="mb-3 text-lg font-semibold">{t(`checkin.caregiver.${qKey}`)}</p>
              <div className="flex gap-2">
                {(['yes', 'no', 'unsure'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setCaregiverAnswers((a) => ({ ...a, [qKey]: option }))}
                    className={`flex-1 rounded-lg border-4 p-2 text-base font-bold ${
                      caregiverAnswers[qKey] === option ? 'border-teal bg-teal text-white' : 'border-ink/20 bg-cream-dark'
                    }`}
                  >
                    {t(`checkin.caregiver.${option}`)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => setStep('summary')}
            className="btn-primary w-full rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {t('checkin.caregiver.continueButton')}
          </button>
        </div>
      )}

      {step === 'summary' && clockResult && (
        <SummaryStep
          clockResult={clockResult}
          wordRecall={{ wordCount: words.length, recalledCount: words.filter((w) => recallText.toLowerCase().includes(w.toLowerCase())).length, words }}
          attention={{ stepsTotal: cfg.attentionSteps, stepsCorrect: attentionCorrect }}
          caregiver={{
            answers: caregiverAnswers,
            flaggedCount: Object.values(caregiverAnswers).filter((a) => a === 'yes').length,
            totalCount: CAREGIVER_QUESTION_KEYS.length,
          }}
          saved={saved}
          copied={copied}
          onSave={() => {
            if (saved) return
            const record = {
              id: crypto.randomUUID(),
              date: new Date().toISOString().slice(0, 10),
              clock: clockResult,
              wordRecall: {
                wordCount: words.length,
                recalledCount: words.filter((w) => recallText.toLowerCase().includes(w.toLowerCase())).length,
                words,
              },
              attention: { stepsTotal: cfg.attentionSteps, stepsCorrect: attentionCorrect },
              caregiver: {
                answers: caregiverAnswers,
                flaggedCount: Object.values(caregiverAnswers).filter((a) => a === 'yes').length,
                totalCount: CAREGIVER_QUESTION_KEYS.length,
              },
            }
            setProfile((p) => saveCheckin(p, record))
            setSaved(true)
          }}
          onCopy={(text) => {
            navigator.clipboard.writeText(text).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            })
          }}
          onDone={() => setStep('intro')}
        />
      )}
    </PageShell>
  )
}

function IntroStep({
  onBegin,
  checkinCount,
  lastDate,
}: {
  onBegin: () => void
  checkinCount: number
  lastDate?: string
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-5">
      <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-6">
        <p className="mb-2 text-xl font-extrabold text-amber-dark">{t('checkin.disclaimerTitle')}</p>
        <p className="text-lg">{t('checkin.disclaimerBody')}</p>
      </div>
      <p className="text-lg opacity-70">
        {checkinCount > 0 ? t('checkin.lastCheckin', { date: lastDate }) : t('checkin.noCheckins')}
      </p>
      <button
        onClick={onBegin}
        className="btn-primary w-full rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
      >
        {t('checkin.startButton')}
      </button>
    </div>
  )
}

function SummaryStep({
  clockResult,
  wordRecall,
  attention,
  caregiver,
  saved,
  copied,
  onSave,
  onCopy,
  onDone,
}: {
  clockResult: ClockResult
  wordRecall: WordRecallResult
  attention: AttentionResult
  caregiver: CaregiverQuestionnaireResult
  saved: boolean
  copied: boolean
  onSave: () => void
  onCopy: (text: string) => void
  onDone: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!saved) onSave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clockRatio = (clockResult.numbersWellPositioned / clockResult.numbersExpected) * 0.6 + (clockResult.handsAccurate ? 1 : 0) * 0.4
  const clockBand = bandFromRatio(clockRatio)
  const wordBand = bandFromRatio(wordRecall.recalledCount / wordRecall.wordCount)
  const attentionBand = bandFromRatio(attention.stepsCorrect / attention.stepsTotal)
  const caregiverBand = bandFromFlagCount(caregiver.flaggedCount, caregiver.totalCount)

  const handsText = clockResult.handsAccurate ? t('checkin.summary.handsAccurate') : t('checkin.summary.handsInaccurate')
  const clockDetail = t('checkin.summary.clockDetail', { placed: clockResult.numbersWellPositioned, hands: handsText })
  const wordDetail = t('checkin.summary.wordRecallDetail', { recalled: wordRecall.recalledCount, total: wordRecall.wordCount })
  const attentionDetail = t('checkin.summary.attentionDetail', { correct: attention.stepsCorrect, total: attention.stepsTotal })
  const caregiverDetail = t('checkin.summary.caregiverDetail', { count: caregiver.flaggedCount, total: caregiver.totalCount })

  const summaryText = [
    t('checkin.summary.title'),
    t('checkin.disclaimerBody'),
    '',
    `${t('checkin.summary.clockLabel')}: ${clockDetail} (${t(`checkin.summary.band.${clockBand}`)})`,
    `${t('checkin.summary.wordRecallLabel')}: ${wordDetail} (${t(`checkin.summary.band.${wordBand}`)})`,
    `${t('checkin.summary.attentionLabel')}: ${attentionDetail} (${t(`checkin.summary.band.${attentionBand}`)})`,
    `${t('checkin.summary.caregiverLabel')}: ${caregiverDetail} (${t(`checkin.summary.band.${caregiverBand}`)})`,
  ].join('\n')

  return (
    <div className="flex flex-col gap-5">
      <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-5">
        <p className="text-lg font-semibold text-amber-dark">{t('checkin.summary.shareNote')}</p>
      </div>

      <div className="surface flex flex-col gap-4 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-lg font-bold">{t('checkin.summary.clockLabel')}</span>
            <BandBadge band={clockBand} />
          </div>
          <p className="text-base opacity-80">{clockDetail}</p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-lg font-bold">{t('checkin.summary.wordRecallLabel')}</span>
            <BandBadge band={wordBand} />
          </div>
          <p className="text-base opacity-80">{wordDetail}</p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-lg font-bold">{t('checkin.summary.attentionLabel')}</span>
            <BandBadge band={attentionBand} />
          </div>
          <p className="text-base opacity-80">{attentionDetail}</p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-lg font-bold">{t('checkin.summary.caregiverLabel')}</span>
            <BandBadge band={caregiverBand} />
          </div>
          <p className="text-base opacity-80">{caregiverDetail}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => onCopy(summaryText)}
          className="flex-1 rounded-xl border-2 border-ink/20 bg-white p-4 text-lg font-bold hover:bg-cream-dark"
        >
          {copied ? t('checkin.summary.copied') : t('checkin.summary.copyButton')}
        </button>
        <button
          onClick={onDone}
          className="flex-1 rounded-xl bg-teal p-4 text-lg font-bold text-white hover:bg-teal-dark"
        >
          {t('checkin.summary.doneButton')}
        </button>
      </div>
    </div>
  )
}
