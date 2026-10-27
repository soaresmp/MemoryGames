import { useTranslation } from 'react-i18next'
import { PageShell } from '../components/ui'
import { CAREGIVER_TIP_KEYS, CAREGIVER_TIP_EMOJIS } from '../lib/sampleData'

export default function CaregiverTips() {
  const { t } = useTranslation()

  return (
    <PageShell title={t('caregiverTips.pageTitle')}>
      <p className="mb-6 text-lg opacity-70">{t('caregiverTips.intro')}</p>
      <div className="flex flex-col gap-4">
        {CAREGIVER_TIP_KEYS.map((key) => (
          <div key={key} className="surface rounded-2xl border-2 border-ink/20 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {CAREGIVER_TIP_EMOJIS[key]}
              </span>
              <h2 className="text-xl font-bold">{t(`caregiverTips.scenarios.${key}.title`)}</h2>
            </div>
            <p className="mb-2 rounded-xl bg-soft-teal p-3 text-lg text-teal-dark">
              <span className="font-bold">{t('caregiverTips.tryLabel')}:</span> {t(`caregiverTips.scenarios.${key}.try`)}
            </p>
            <p className="rounded-xl bg-soft-amber p-3 text-lg text-amber-dark">
              <span className="font-bold">{t('caregiverTips.insteadLabel')}:</span> {t(`caregiverTips.scenarios.${key}.avoid`)}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
