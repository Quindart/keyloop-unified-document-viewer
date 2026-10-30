import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './auth-store';

export function SessionPending() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <p role="status">{t('account.restoringSession')}</p>
    </main>
  );
}
export function AuthGate({ children }: { children: ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  if (!hydrated) return <SessionPending />;
  if (!user || (user.kind === 'demo' && user.username !== 'admin'))
    return <Navigate to="/login" replace />;
  return children;
}
