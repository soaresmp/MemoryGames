import { PageShell } from '../components/ui'
import { useProfile } from '../lib/ProfileContext'
import type { ExerciseId } from '../lib/types'

const EXERCISE_NAMES: Record<ExerciseId, string> = {
  orientation: 'Where & When',
  faceName: 'Faces I Know',
  matchPairs: 'Matching Pairs',
  categorySort: 'Sort It Out',
  routineSequence: 'What Comes Next',
  reminiscence: 'Memory Lane',
}

function engagementLabel(success: number): { label: string; tone: string } {
  if (success >= 0.75) return { label: 'Great engagement', tone: 'text-teal-dark bg-soft-teal' }
  if (success >= 0.4) return { label: 'Good engagement', tone: 'text-amber-dark bg-soft-amber' }
  return { label: 'Needed extra support', tone: 'text-amber-dark bg-soft-amber' }
}

export default function Progress() {
  const { profile } = useProfile()
  const recent = [...profile.log].reverse().slice(0, 20)

  const last7 = profile.log.filter((entry) => {
    const days = (Date.now() - new Date(entry.date).getTime()) / 86400000
    return days <= 7
  })

  const counts = profile.log.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.exerciseId] = (acc[entry.exerciseId] ?? 0) + 1
    return acc
  }, {})

  return (
    <PageShell title="Progress">
      <p className="mb-6 text-lg opacity-70">
        This is a gentle activity log for family and caregivers — not a test score. Consistency and enjoyment
        matter more than "getting it right."
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-5 text-center">
          <p className="text-4xl font-extrabold text-teal-dark">{profile.streakDays}</p>
          <p className="text-lg">day streak</p>
        </div>
        <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-5 text-center">
          <p className="text-4xl font-extrabold text-amber-dark">{last7.length}</p>
          <p className="text-lg">sessions this week</p>
        </div>
      </div>

      {Object.keys(counts).length > 0 && (
        <div className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold">Activity by exercise</h2>
          <div className="flex flex-col gap-2">
            {(Object.entries(counts) as [ExerciseId, number][]).map(([id, count]) => (
              <div key={id} className="flex items-center justify-between text-lg">
                <span>{EXERCISE_NAMES[id]}</span>
                <span className="font-semibold">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Recent sessions</h2>
        {recent.length === 0 ? (
          <p className="text-lg opacity-70">No sessions logged yet — try an exercise from the home screen.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((entry, i) => {
              const eng = engagementLabel(entry.success)
              return (
                <li key={i} className="flex items-center justify-between gap-2 text-lg">
                  <span>
                    {entry.date} · {EXERCISE_NAMES[entry.exerciseId]}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${eng.tone}`}>{eng.label}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </PageShell>
  )
}
