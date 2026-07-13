import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  expectedNumberAngle,
  isHourHandAccurate,
  isMinuteHandAccurate,
  isNumberWellPositioned,
  pointToClockAngle,
} from '../../lib/checkin'
import type { ClockResult } from '../../lib/types'

const SIZE = 300
const CENTER = SIZE / 2
const FACE_RADIUS = 130
const HOUR_RADIUS = 68
const MINUTE_RADIUS = 108

function angleToPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: CENTER + radius * Math.sin(rad), y: CENTER - radius * Math.cos(rad) }
}

interface PlacedNumber {
  num: number
  x: number
  y: number
  angle: number
}

export default function ClockTask({
  showNumbers,
  targetHour,
  targetMinute,
  onComplete,
}: {
  showNumbers: boolean
  targetHour: number
  targetMinute: number
  onComplete: (result: ClockResult) => void
}) {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)
  const [phase, setPhase] = useState<'numbers' | 'hands'>(showNumbers ? 'hands' : 'numbers')
  const [placed, setPlaced] = useState<PlacedNumber[]>([])
  const [hourAngle, setHourAngle] = useState(0)
  const [minuteAngle, setMinuteAngle] = useState(0)
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null)

  const nextNumber = placed.length + 1

  const svgPoint = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * SIZE
    const y = ((clientY - rect.top) / rect.height) * SIZE
    return { x, y }
  }

  const placeNumber = (clientX: number, clientY: number) => {
    if (phase !== 'numbers' || nextNumber > 12) return
    const { x, y } = svgPoint(clientX, clientY)
    const angle = pointToClockAngle(x - CENTER, y - CENTER)
    const updated = [...placed, { num: nextNumber, x, y, angle }]
    setPlaced(updated)
    if (updated.length >= 12) setPhase('hands')
  }

  const finishNumbersEarly = () => setPhase('hands')

  const moveHand = (hand: 'hour' | 'minute', clientX: number, clientY: number) => {
    const { x, y } = svgPoint(clientX, clientY)
    const angle = pointToClockAngle(x - CENTER, y - CENTER)
    if (hand === 'hour') setHourAngle(angle)
    else setMinuteAngle(angle)
  }

  const finishHands = () => {
    const numbersWellPositioned = showNumbers
      ? 12
      : placed.filter((p) => isNumberWellPositioned(p.angle, expectedNumberAngle(p.num))).length
    const handsAccurate =
      isHourHandAccurate(hourAngle, targetHour, targetMinute) && isMinuteHandAccurate(minuteAngle, targetMinute)
    onComplete({
      numbersExpected: 12,
      numbersPlaced: showNumbers ? 12 : placed.length,
      numbersWellPositioned,
      handsAccurate,
      targetHour,
      targetMinute,
    })
  }

  const hourTip = angleToPoint(hourAngle, HOUR_RADIUS)
  const minuteTip = angleToPoint(minuteAngle, MINUTE_RADIUS)

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl font-bold">
        {phase === 'numbers' ? t('checkin.clock.numbersInstructions') : t('checkin.clock.handsInstructions', { time: `${targetHour}:${String(targetMinute).padStart(2, '0')}` })}
      </p>
      {phase === 'numbers' && (
        <p className="text-lg opacity-70">{t('checkin.step', { current: nextNumber > 12 ? 12 : nextNumber, total: 12 })}</p>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="surface touch-none select-none rounded-full border-4 border-ink/20 bg-white"
        style={{ width: 280, height: 280 }}
        onPointerDown={(e) => {
          if (phase === 'numbers') {
            placeNumber(e.clientX, e.clientY)
          }
        }}
      >
        <circle cx={CENTER} cy={CENTER} r={FACE_RADIUS} fill="none" stroke="#2b2620" strokeOpacity={0.15} strokeWidth={3} />
        <circle cx={CENTER} cy={CENTER} r={4} fill="#2b2620" />

        {showNumbers &&
          Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
            const pos = angleToPoint(expectedNumberAngle(n), FACE_RADIUS - 22)
            return (
              <text key={n} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight="bold" fill="#2b2620">
                {n}
              </text>
            )
          })}

        {!showNumbers &&
          placed.map((p) => (
            <text key={p.num} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight="bold" fill="#0b423b">
              {p.num}
            </text>
          ))}

        {phase === 'hands' && (
          <>
            <line x1={CENTER} y1={CENTER} x2={hourTip.x} y2={hourTip.y} stroke="#92400e" strokeWidth={7} strokeLinecap="round" />
            <line x1={CENTER} y1={CENTER} x2={minuteTip.x} y2={minuteTip.y} stroke="#0f5b52" strokeWidth={4} strokeLinecap="round" />
            <circle
              cx={hourTip.x}
              cy={hourTip.y}
              r={16}
              fill="#92400e"
              aria-label={t('checkin.clock.hourHand')}
              onPointerDown={(e) => {
                e.stopPropagation()
                e.currentTarget.setPointerCapture(e.pointerId)
                setDragging('hour')
              }}
              onPointerMove={(e) => {
                if (dragging === 'hour') moveHand('hour', e.clientX, e.clientY)
              }}
              onPointerUp={() => setDragging(null)}
            />
            <circle
              cx={minuteTip.x}
              cy={minuteTip.y}
              r={14}
              fill="#0f5b52"
              aria-label={t('checkin.clock.minuteHand')}
              onPointerDown={(e) => {
                e.stopPropagation()
                e.currentTarget.setPointerCapture(e.pointerId)
                setDragging('minute')
              }}
              onPointerMove={(e) => {
                if (dragging === 'minute') moveHand('minute', e.clientX, e.clientY)
              }}
              onPointerUp={() => setDragging(null)}
            />
          </>
        )}
      </svg>

      {phase === 'numbers' && nextNumber <= 12 && (
        <button onClick={finishNumbersEarly} className="text-base font-semibold underline opacity-60 hover:opacity-100">
          {t('checkin.clock.skipNumbers')}
        </button>
      )}

      {phase === 'hands' && (
        <button
          onClick={finishHands}
          className="btn-primary w-full max-w-xs rounded-xl bg-teal p-4 text-xl font-bold text-white hover:bg-teal-dark"
        >
          {t('checkin.clock.doneButton')}
        </button>
      )}
    </div>
  )
}
