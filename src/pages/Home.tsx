import { BigButton } from '../components/ui'
import { useProfile } from '../lib/ProfileContext'
import { STAGE_LABEL } from '../lib/types'

function timeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { profile } = useProfile()

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-5 py-8">
      <header className="mb-8 text-center">
        <p className="text-2xl">
          {timeOfDayGreeting()}, {profile.name} 👋
        </p>
        <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">MindTrail</h1>
        <p className="mt-2 text-xl opacity-80">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {profile.streakDays > 0 && (
          <p className="mt-3 inline-block rounded-full bg-soft-amber px-5 py-2 text-xl font-bold text-amber-dark">
            🔥 {profile.streakDays} day{profile.streakDays === 1 ? '' : 's'} in a row
          </p>
        )}
      </header>

      <div className="mb-8 flex flex-col gap-4">
        <BigButton to="/today" emoji="🗓️" label="Today" sublabel="What day is it? Let's check in" tone="teal" />
        <BigButton to="/exercises" emoji="🧠" label="Brain Exercises" sublabel="Short, friendly activities" />
        <BigButton to="/reminisce" emoji="📷" label="Memory Lane" sublabel="Talk about old times" tone="teal" />
      </div>

      <div className="flex flex-col gap-3 border-t-2 border-ink/10 pt-6">
        <p className="text-center text-lg opacity-70">For family &amp; caregivers</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <BigButton to="/progress" emoji="📈" label="Progress" sublabel="See recent activity" tone="teal" />
          </div>
          <div className="flex-1">
            <BigButton to="/settings" emoji="⚙️" label="Settings" sublabel={STAGE_LABEL[profile.stage]} tone="teal" />
          </div>
        </div>
      </div>
    </div>
  )
}
