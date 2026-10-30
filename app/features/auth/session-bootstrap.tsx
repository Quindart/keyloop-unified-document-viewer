import { useEffect } from 'react';
import type { GoogleAuthUser } from './auth-types';
import { useAuthStore } from './auth-store';

export function SessionBootstrap() {
  useEffect(() => {
    void Promise.all([
      useAuthStore.getState().hydrate(),
      fetch('/auth/session', { credentials: 'same-origin' })
        .then(async (response) => {
          if (!response.ok) return null;
          const payload: unknown = await response.json();
          if (
            typeof payload !== 'object' ||
            payload === null ||
            !('user' in payload)
          )
            return null;
          const user = payload.user;
          return typeof user === 'object' &&
            user !== null &&
            'kind' in user &&
            user.kind === 'google' &&
            'subject' in user &&
            typeof user.subject === 'string' &&
            'email' in user &&
            typeof user.email === 'string' &&
            'name' in user &&
            (typeof user.name === 'string' || user.name === null)
            ? (user as GoogleAuthUser)
            : null;
        })
        .catch(() => null),
    ]).then(([, googleUser]) => {
      useAuthStore.getState().finishHydration(googleUser);
    });
  }, []);
  return null;
}
