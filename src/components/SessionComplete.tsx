import { HomeLink } from './ui'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Shown after every exercise — always warm, never a "score" to feel judged by. */
export default function SessionComplete({ nextTo }: { nextTo?: { to: string; label: string } }) {
  const { t } = useTranslation()
  return (
    <div className="surface flex flex-col items-center gap-5 rounded-2xl border-4 border-teal bg-soft-teal p-8 text-center">
      <span className="text-6xl" aria-hidden="true">
        🎉
      </span>
      <h2 className="text-3xl font-extrabold text-teal-dark">{t('common.sessionCompleteTitle')}</h2>
      <p className="text-xl">{t('common.sessionCompleteBody')}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {nextTo && (
          <Link
            to={nextTo.to}
            className="rounded-xl bg-teal px-6 py-4 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {t('common.tryNext', { label: nextTo.label })}
          </Link>
        )}
        <HomeLink />
      </div>
    </div>
  )
}
