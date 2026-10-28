import type { LoginPhase } from './use-login';
import { useTranslation } from 'react-i18next';

export function LoginProgress({ phase }: { phase: LoginPhase }) {
  const { t } = useTranslation();
  if (phase === 'idle') return null;
  return (
    <div>
      <div
        role="progressbar"
        aria-label={t('login.progress')}
        className="h-1 overflow-hidden rounded-full bg-slate-100"
      >
        <div className="h-full w-full bg-slate-900 motion-safe:animate-pulse" />
      </div>
      <p
        role="status"
        aria-live="polite"
        className="mt-2 text-sm text-slate-600"
      >
        {phase === 'submitting'
          ? t('login.submitting')
          : t('login.redirecting')}
      </p>
    </div>
  );
}
