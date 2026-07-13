import { useTranslation } from 'react-i18next'
import { PageShell } from '../components/ui'
import { useProfile } from '../lib/ProfileContext'
import type { ExerciseId } from '../lib/types'

function engagementKey(success: number): { key: string; tone: string } {
  if (success >= 0.75) return { key: 'great', tone: 'text-teal-dark bg-soft-teal' }
  if (success >= 0.4) return { key: 'good', tone: 'text-amber-dark bg-soft-amber' }
  return { key: 'extra', tone: 'text-amber-dark bg-soft-amber' }
}

export default function Progress() {
  const { profile } = useProfile()
  const { t } = useTranslation()
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
    <PageShell title={t('progress.pageTitle')}>
      <p className="mb-6 text-lg opacity-70">{t('progress.intro')}</p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="surface rounded-2xl border-4 border-teal bg-soft-teal p-5 text-center">
          <p className="text-4xl font-extrabold text-teal-dark">{profile.streakDays}</p>
          <p className="text-lg">{t('progress.streakLabel')}</p>
        </div>
        <div className="surface rounded-2xl border-4 border-amber bg-soft-amber p-5 text-center">
          <p className="text-4xl font-extrabold text-amber-dark">{last7.length}</p>
          <p className="text-lg">{t('progress.sessionsThisWeek')}</p>
        </div>
      </div>

      {Object.keys(counts).length > 0 && (
        <div className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
          <h2 className="mb-3 text-xl font-bold">{t('progress.activityByExercise')}</h2>
          <div className="flex flex-col gap-2">
            {(Object.entries(counts) as [ExerciseId, number][]).map(([id, count]) => (
              <div key={id} className="flex items-center justify-between text-lg">
                <span>{t(`progress.exerciseNames.${id}`)}</span>
                <span className="font-semibold">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">{t('progress.recentSessions')}</h2>
        {recent.length === 0 ? (
          <p className="text-lg opacity-70">{t('progress.noSessions')}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((entry, i) => {
              const eng = engagementKey(entry.success)
              return (
                <li key={i} className="flex items-center justify-between gap-2 text-lg">
                  <span>
                    {entry.date} · {t(`progress.exerciseNames.${entry.exerciseId}`)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${eng.tone}`}>
                    {t(`progress.engagement.${eng.key}`)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </PageShell>
  )
}
