import { useTranslation } from 'react-i18next'
import { BigButton } from '../components/ui'
import { useProfile } from '../lib/ProfileContext'
import { DATE_LOCALE, type Language } from '../i18n'

function timeOfDayGreetingKey(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'home.greetingMorning'
  if (hour < 18) return 'home.greetingAfternoon'
  return 'home.greetingEvening'
}

export default function Home() {
  const { profile } = useProfile()
  const { t } = useTranslation()

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-5 py-8">
      <header className="mb-8 text-center">
        <p className="text-2xl">
          {t(timeOfDayGreetingKey())}, {profile.name} 👋
        </p>
        <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{t('home.appName')}</h1>
        <p className="mt-2 text-xl opacity-80">
          {new Date().toLocaleDateString(DATE_LOCALE[profile.language as Language], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {profile.streakDays > 0 && (
          <p className="mt-3 inline-block rounded-full bg-soft-amber px-5 py-2 text-xl font-bold text-amber-dark">
            🔥 {t('home.streak', { count: profile.streakDays })}
          </p>
        )}
      </header>

      <div className="mb-8 flex flex-col gap-4">
        <BigButton to="/today" emoji="🗓️" label={t('home.todayTitle')} sublabel={t('home.todaySub')} tone="teal" />
        <BigButton to="/exercises" emoji="🧠" label={t('home.exercisesTitle')} sublabel={t('home.exercisesSub')} />
        <BigButton to="/reminisce" emoji="📷" label={t('home.reminisceTitle')} sublabel={t('home.reminisceSub')} tone="teal" />
      </div>

      <div className="flex flex-col gap-3 border-t-2 border-ink/10 pt-6">
        <p className="text-center text-lg opacity-70">{t('home.forFamily')}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <BigButton to="/progress" emoji="📈" label={t('home.progressTitle')} sublabel={t('home.progressSub')} tone="teal" />
          </div>
          <div className="flex-1">
            <BigButton
              to="/settings"
              emoji="⚙️"
              label={t('home.settingsTitle')}
              sublabel={t(`stage.${profile.stage}`)}
              tone="teal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
