import { useTranslation } from 'react-i18next'
import { BigButton, PageShell } from '../components/ui'

export default function ExerciseHub() {
  const { t } = useTranslation()
  return (
    <PageShell title={t('exerciseHub.title')}>
      <p className="mb-6 text-xl opacity-80">{t('exerciseHub.subtitle')}</p>
      <div className="flex flex-col gap-4">
        <BigButton
          to="/exercises/orientation"
          emoji="🗓️"
          label={t('exerciseHub.orientationTitle')}
          sublabel={t('exerciseHub.orientationSub')}
        />
        <BigButton
          to="/exercises/faces"
          emoji="👪"
          label={t('exerciseHub.faceNameTitle')}
          sublabel={t('exerciseHub.faceNameSub')}
          tone="teal"
        />
        <BigButton
          to="/exercises/match"
          emoji="🃏"
          label={t('exerciseHub.matchTitle')}
          sublabel={t('exerciseHub.matchSub')}
        />
        <BigButton
          to="/exercises/sort"
          emoji="🗂️"
          label={t('exerciseHub.sortTitle')}
          sublabel={t('exerciseHub.sortSub')}
          tone="teal"
        />
        <BigButton
          to="/exercises/routine"
          emoji="📋"
          label={t('exerciseHub.routineTitle')}
          sublabel={t('exerciseHub.routineSub')}
        />
      </div>
    </PageShell>
  )
}
