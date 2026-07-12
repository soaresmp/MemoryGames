import { HomeLink } from './ui'
import { Link } from 'react-router-dom'

/** Shown after every exercise — always warm, never a "score" to feel judged by. */
export default function SessionComplete({ nextTo }: { nextTo?: { to: string; label: string } }) {
  return (
    <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
      <span className="text-6xl" aria-hidden="true">
        🎉
      </span>
      <h2 className="text-3xl font-extrabold text-teal-dark">Nicely done!</h2>
      <p className="text-xl">That's the exercise finished for now.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {nextTo && (
          <Link
            to={nextTo.to}
            className="rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            Try {nextTo.label}
          </Link>
        )}
        <HomeLink />
      </div>
    </div>
  )
}
