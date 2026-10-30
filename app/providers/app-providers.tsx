import type { ReactNode } from 'react';
import { SnackbarProvider, closeSnackbar, type SnackbarKey } from 'notistack';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SessionBootstrap } from '~/features/auth/session-bootstrap';
import '~/i18n/i18n';

function NotificationCloseAction({
  snackbarKey,
  label,
}: {
  snackbarKey: SnackbarKey;
  label: string;
}) {
  function handleCloseNotification() {
    closeSnackbar(snackbarKey);
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleCloseNotification}
      className="rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <X size={18} aria-hidden="true" />
    </button>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  function renderSnackbarAction(key: SnackbarKey) {
    return (
      <NotificationCloseAction
        snackbarKey={key}
        label={t('accessibility.closeNotification')}
      />
    );
  }

  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      maxSnack={2}
      preventDuplicate
      autoHideDuration={6000}
      action={renderSnackbarAction}
    >
      <SessionBootstrap />
      {children}
    </SnackbarProvider>
  );
}
